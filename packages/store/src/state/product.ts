'use client';

import { create } from 'zustand';
import type { ProductGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeProducts: (data: ProductGet[]) => void;
  deleteProduct: (data: ProductGet) => void;
  deleteProducts: (data: ProductGet[]) => void;
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
      products: state.products?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeProducts: (incomingProducts) => {
    set((state) => {
      if (!incomingProducts || incomingProducts.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.products) {
        return { products: incomingProducts };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingProducts.map((n) => [String(n.id), n]));

      // 1. Update existing products in place if fields differ
      const nextProducts = state.products.map((existing) => {
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

      // 2. Append new products that aren't in the store yet
      const existingIds = new Set(state.products.map((n) => String(n.id)));
      for (const incoming of incomingProducts) {
        if (!existingIds.has(String(incoming.id))) {
          nextProducts.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { products: nextProducts };
    });
  },

  deleteProduct: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      products: state.products?.filter((i) => i.id !== data.id) ?? undefined,
    }));
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
