import { create } from 'zustand';
import type { ProductVariantGet } from '@repo/types/models/product-variant';

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
        state.productVariants?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteProductVariant: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      productVariants: state.productVariants?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
