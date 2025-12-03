import { ProductGet } from '@repo/types/models/product';
import { create } from 'zustand';
// import type { ProductRelations } from '@repo/types/models/product';

export type ProductsValue = ProductGet[] | null | undefined;

interface ProductState {
  products: ProductsValue;
  deleted: ProductGet[];
  setProducts: (data: ProductsValue) => void;
  setDeletedProducts: (data: ProductsValue) => void;
  clearProducts: () => void;
  clearDeletedProducts: () => void;
  addProduct: (data: ProductGet) => void;
  updateProduct: (data: ProductGet) => void;
  deleteProduct: (data: ProductGet) => void;
}

export const useStoreProduct = create<ProductState>((set) => ({
  products: undefined,
  deleted: [],

  setProducts: (data) => {
    set({ products: data });
  },

  setDeletedProducts: (data) => {
    set({ deleted: data || [] });
  },

  clearProducts: () => {
    set({ products: [] });
  },

  clearDeletedProducts: () => {
    set({ deleted: [] });
  },

  addProduct: (data) => {
    set((state) => ({
      products: [...(state.products ?? []), data],
    }));
  },

  updateProduct: (data) => {
    set((state) => ({
      products:
        state.products?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteProduct: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      products: state.products?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
