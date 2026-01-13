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
  addCartItems: (data: CartItemGet) => void;
  updateCartItems: (data: CartItemGet) => void;
  deleteCartItems: (data: CartItemGet) => void;
}

export const useStoreCartItems = create<CartItemsState>((set) => ({
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

  addCartItems: (data) => {
    set((state) => ({
      cartItems: [...(state.cartItems ?? []), data],
    }));
  },

  updateCartItems: (data) => {
    set((state) => ({
      cartItems:
        state.cartItems?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteCartItems: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      cartItems: state.cartItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
