'use client';

import { create } from 'zustand';
import type { RecipieItemGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type RecipieItemsValue = RecipieItemGet[] | null | undefined;

interface RecipieItemState {
  recipieItems: RecipieItemsValue;
  deleted: RecipieItemGet[];
  setRecipieItems: (data: RecipieItemsValue) => void;
  setDeletedRecipieItems: (data: RecipieItemsValue) => void;
  clearRecipieItems: () => void;
  clearDeletedRecipieItems: () => void;
  addRecipieItem: (data: RecipieItemGet) => void;
  updateRecipieItem: (data: RecipieItemGet) => void;
  mergeRecipieItems: (data: RecipieItemGet[]) => void;
  deleteRecipieItem: (data: RecipieItemGet) => void;
  deleteRecipieItems: (data: RecipieItemGet[]) => void;
}

export const useStoreRecipieItem = create<RecipieItemState>((set) => ({
  recipieItems: undefined,
  deleted: [],

  setRecipieItems: (data) => {
    set({ recipieItems: data });
  },

  setDeletedRecipieItems: (data) => {
    set({ deleted: data || [] });
  },

  clearRecipieItems: () => {
    set({ recipieItems: [] });
  },

  clearDeletedRecipieItems: () => {
    set({ deleted: [] });
  },

  addRecipieItem: (data) => {
    set((state) => ({
      recipieItems: [...(state.recipieItems ?? []), data],
    }));
  },

  updateRecipieItem: (data) => {
    set((state) => ({
      recipieItems:
        state.recipieItems?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeRecipieItems: (incomingRecipieItems) => {
    set((state) => {
      if (!incomingRecipieItems || incomingRecipieItems.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.recipieItems) {
        return { recipieItems: incomingRecipieItems };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingRecipieItems.map((n) => [String(n.id), n]));

      // 1. Update existing recipieItems in place if fields differ
      const nextRecipieItems = state.recipieItems.map((existing) => {
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

      // 2. Append new recipieItems that aren't in the store yet
      const existingIds = new Set(state.recipieItems.map((n) => String(n.id)));
      for (const incoming of incomingRecipieItems) {
        if (!existingIds.has(String(incoming.id))) {
          nextRecipieItems.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { recipieItems: nextRecipieItems };
    });
  },

  deleteRecipieItem: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      recipieItems: state.recipieItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },

  deleteRecipieItems: (data) => {
    set((state) => {
      if (!state.recipieItems) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        recipieItems: state.recipieItems.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
