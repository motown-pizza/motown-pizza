'use client';

import { create } from 'zustand';
import type { WishlistItemGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type WishlistItemsValue = WishlistItemGet[] | null | undefined;

interface WishlistItemState {
  wishlistItems: WishlistItemsValue;
  deleted: WishlistItemGet[];
  setWishlistItems: (data: WishlistItemsValue) => void;
  setDeletedWishlistItems: (data: WishlistItemsValue) => void;
  clearWishlistItems: () => void;
  clearDeletedWishlistItems: () => void;
  addWishlistItem: (data: WishlistItemGet) => void;
  updateWishlistItem: (data: WishlistItemGet) => void;
  mergeWishlistItems: (data: WishlistItemGet[]) => void;
  deleteWishlistItem: (data: WishlistItemGet) => void;
}

export const useStoreWishlistItem = create<WishlistItemState>((set) => ({
  wishlistItems: undefined,
  deleted: [],

  setWishlistItems: (data) => {
    set({ wishlistItems: data });
  },

  setDeletedWishlistItems: (data) => {
    set({ deleted: data || [] });
  },

  clearWishlistItems: () => {
    set({ wishlistItems: [] });
  },

  clearDeletedWishlistItems: () => {
    set({ deleted: [] });
  },

  addWishlistItem: (data) => {
    set((state) => ({
      wishlistItems: [...(state.wishlistItems ?? []), data],
    }));
  },

  updateWishlistItem: (data) => {
    set((state) => ({
      wishlistItems:
        state.wishlistItems?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeWishlistItems: (incomingWishlistItems) => {
    set((state) => {
      if (!incomingWishlistItems || incomingWishlistItems.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.wishlistItems) {
        return { wishlistItems: incomingWishlistItems };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingWishlistItems.map((n) => [String(n.id), n]));

      // 1. Update existing wishlistItems in place if fields differ
      const nextWishlistItems = state.wishlistItems.map((existing) => {
        const incoming = incomingMap.get(String(existing.id));
        if (!incoming) return existing;

        // Check if any property changed
        const isDifferent = hasChanges(existing, incoming);

        if (isDifferent) {
          hasChanged = true;
          return { ...existing, ...incoming };
        }

        // Return exact same reference if nothing changed
        return existing;
      });

      // 2. Append new wishlistItems that aren't in the store yet
      const existingIds = new Set(state.wishlistItems.map((n) => String(n.id)));
      for (const incoming of incomingWishlistItems) {
        if (!existingIds.has(String(incoming.id))) {
          nextWishlistItems.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { wishlistItems: nextWishlistItems };
    });
  },

  deleteWishlistItem: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      wishlistItems: state.wishlistItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
