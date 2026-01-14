import { CartItemGet } from '@repo/types/models/cart-item';
import { create } from 'zustand';
// import type { CartItemsRelations } from '@repo/types/models/cart';

export type CartItemsValue = CartItemGet[] | null | undefined;

interface CartItemsState {
  cartItems: CartItemsValue;
  deleted: CartItemGet[];
  setCartItems: (data: CartItemsValue) => void;
  setDeletedCartItems: (data: CartItemsValue) => void;
  clearCartItems: () => void;
  clearDeletedCartItems: () => void;
  addCartItem: (data: CartItemGet) => void;
  updateCartItem: (data: CartItemGet) => void;
  deleteCartItem: (data: CartItemGet) => void;
  deleteCartItems: (data: CartItemGet[]) => void;
}

export const useStoreCartItem = create<CartItemsState>((set) => ({
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

  addCartItem: (item) => {
    set((state) => {
      if (!state.cartItems) return {};

      return {
        cartItems: state.cartItems.includes(item)
          ? state.cartItems
          : [...state.cartItems, item],
      };
    });
  },

  updateCartItem: (data) => {
    set((state) => {
      if (!state.cartItems) return {};

      let changed = false;

      const updated = state.cartItems.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { cartItems: updated } : {};
    });
  },

  deleteCartItem: (data) => {
    set((state) => {
      if (!state.cartItems) return {};

      const exists = state.cartItems.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        cartItems: state.cartItems.filter((i) => i.id !== data.id),
      };
    });
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
