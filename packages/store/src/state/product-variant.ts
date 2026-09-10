'use client';

import { create } from 'zustand';
import type { ProductVariantGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type ProductVariantsValue = ProductVariantGet[] | null | undefined;

interface ProductVariantState {
  productVariants: ProductVariantsValue;
  deleted: ProductVariantGet[];
  setProductVariants: (data: ProductVariantsValue) => void;
  setDeletedProductVariants: (data: ProductVariantsValue) => void;
  clearProductVariants: () => void;
  clearDeletedProductVariants: () => void;
  addProductVariant: (data: ProductVariantGet) => void;
  updateProductVariant: (data: ProductVariantGet) => void;
  mergeProductVariants: (data: ProductVariantGet[]) => void;
  deleteProductVariant: (data: ProductVariantGet) => void;
}

export const useStoreProductVariant = create<ProductVariantState>((set) => ({
  productVariants: undefined,
  deleted: [],

  setProductVariants: (data) => {
    set({ productVariants: data });
  },

  setDeletedProductVariants: (data) => {
    set({ deleted: data || [] });
  },

  clearProductVariants: () => {
    set({ productVariants: [] });
  },

  clearDeletedProductVariants: () => {
    set({ deleted: [] });
  },

  addProductVariant: (data) => {
    set((state) => ({
      productVariants: [...(state.productVariants ?? []), data],
    }));
  },

  updateProductVariant: (data) => {
    set((state) => ({
      productVariants:
        state.productVariants?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeProductVariants: (incomingProductVariants) => {
    set((state) => {
      if (!incomingProductVariants || incomingProductVariants.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.productVariants) {
        return { productVariants: incomingProductVariants };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingProductVariants.map((n) => [String(n.id), n]));

      // 1. Update existing productVariants in place if fields differ
      const nextProductVariants = state.productVariants.map((existing) => {
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

      // 2. Append new productVariants that aren't in the store yet
      const existingIds = new Set(state.productVariants.map((n) => String(n.id)));
      for (const incoming of incomingProductVariants) {
        if (!existingIds.has(String(incoming.id))) {
          nextProductVariants.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { productVariants: nextProductVariants };
    });
  },

  deleteProductVariant: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      productVariants: state.productVariants?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
