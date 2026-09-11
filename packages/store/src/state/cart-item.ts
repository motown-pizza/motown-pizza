'use client';

import { create } from 'zustand';
import type { CartItemGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type CartItemsValue = CartItemGet[] | null | undefined;

interface CartItemState {
  cartItems: CartItemsValue;
  deleted: CartItemGet[];
  setCartItems: (data: CartItemsValue) => void;
  setDeletedCartItems: (data: CartItemsValue) => void;
  clearCartItems: () => void;
  clearDeletedCartItems: () => void;
  addCartItem: (data: CartItemGet) => void;
  updateCartItem: (data: CartItemGet) => void;
  mergeCartItems: (data: CartItemGet[]) => void;
  deleteCartItem: (data: CartItemGet) => void;
  deleteCartItems: (data: CartItemGet[]) => void;
}

export const useStoreCartItem = create<CartItemState>((set) => ({
  cartItems: undefined,
  deleted: [],

  setCartItems: (data) => {
    set({ cartItems: data });
  },

  setDeletedCartItems: (data) => {
    set({ deleted: data || [] });
  },

  clearCartItems: () => {
    set({ cartItems: [] });
  },

  clearDeletedCartItems: () => {
    set({ deleted: [] });
  },

  addCartItem: (data) => {
    set((state) => ({
      cartItems: [...(state.cartItems ?? []), data],
    }));
  },

  updateCartItem: (data) => {
    set((state) => ({
      cartItems: state.cartItems?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeCartItems: (incomingCartItems) => {
    set((state) => {
      if (!incomingCartItems || incomingCartItems.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.cartItems) {
        return { cartItems: incomingCartItems };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingCartItems.map((n) => [String(n.id), n]));

      // 1. Update existing cartItems in place if fields differ
      const nextCartItems = state.cartItems.map((existing) => {
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

      // 2. Append new cartItems that aren't in the store yet
      const existingIds = new Set(state.cartItems.map((n) => String(n.id)));
      for (const incoming of incomingCartItems) {
        if (!existingIds.has(String(incoming.id))) {
          nextCartItems.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { cartItems: nextCartItems };
    });
  },

  deleteCartItem: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      cartItems: state.cartItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },

  deleteCartItems: (data) => {
    set((state) => {
      if (!state.cartItems) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        cartItems: state.cartItems.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
