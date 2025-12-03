import { ProductGet } from '@repo/types/models/product';
import { create } from 'zustand';
// import type { CartRelations } from '@repo/types/models/cart';

export type CartValue = ProductGet[] | null | undefined;

interface CartState {
  cart: CartValue;
  deleted: ProductGet[];
  setCart: (data: CartValue) => void;
  setDeletedCart: (data: CartValue) => void;
  clearCart: () => void;
  clearDeletedCart: () => void;
  addCart: (data: ProductGet) => void;
  updateCart: (data: ProductGet) => void;
  deleteCart: (data: ProductGet) => void;
}

export const useStoreCart = create<CartState>((set) => ({
  cart: undefined,
  deleted: [],

  setCart: (data) => {
    set({ cart: data });
  },

  setDeletedCart: (data) => {
    set({ deleted: data || [] });
  },

  clearCart: () => {
    set({ cart: [] });
  },

  clearDeletedCart: () => {
    set({ deleted: [] });
  },

  addCart: (data) => {
    set((state) => ({
      cart: [...(state.cart ?? []), data],
    }));
  },

  updateCart: (data) => {
    set((state) => ({
      cart:
        state.cart?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteCart: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      cart: state.cart?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
