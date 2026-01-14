import { ProductGet } from '@repo/types/models/product';
import { create } from 'zustand';
// import type { ProductsRelations } from '@repo/types/models/cart';

export type ProductsValue = ProductGet[] | null | undefined;

interface ProductsState {
  products: ProductsValue;
  deleted: ProductGet[];
  setProducts: (data: ProductsValue) => void;
  setDeletedProducts: (data: ProductsValue) => void;
  clearProducts: () => void;
  clearDeletedProducts: () => void;
  addProduct: (data: ProductGet) => void;
  updateProduct: (data: ProductGet) => void;
  deleteProduct: (data: ProductGet) => void;
  deleteProducts: (data: ProductGet[]) => void;
}

export const useStoreProduct = create<ProductsState>((set) => ({
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

  addProduct: (item) => {
    set((state) => {
      if (!state.products) return {};

      return {
        products: state.products.includes(item)
          ? state.products
          : [...state.products, item],
      };
    });
  },

  updateProduct: (data) => {
    set((state) => {
      if (!state.products) return {};

      let changed = false;

      const updated = state.products.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { products: updated } : {};
    });
  },

  deleteProduct: (data) => {
    set((state) => {
      if (!state.products) return {};

      const exists = state.products.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        products: state.products.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteProducts: (data) => {
    set((state) => {
      if (!state.products) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        products: state.products.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
