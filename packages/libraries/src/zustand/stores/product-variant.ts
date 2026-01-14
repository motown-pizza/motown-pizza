import { ProductVariantGet } from '@repo/types/models/product-variant';
import { create } from 'zustand';
// import type { ProductVariantsRelations } from '@repo/types/models/cart';

export type ProductVariantsValue = ProductVariantGet[] | null | undefined;

interface ProductVariantsState {
  productVariants: ProductVariantsValue;
  deleted: ProductVariantGet[];
  setProductVariants: (data: ProductVariantsValue) => void;
  setDeletedProductVariants: (data: ProductVariantsValue) => void;
  clearProductVariants: () => void;
  clearDeletedProductVariants: () => void;
  addProductVariant: (data: ProductVariantGet) => void;
  updateProductVariant: (data: ProductVariantGet) => void;
  deleteProductVariant: (data: ProductVariantGet) => void;
  deleteProductVariants: (data: ProductVariantGet[]) => void;
}

export const useStoreProductVariant = create<ProductVariantsState>((set) => ({
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

  addProductVariant: (item) => {
    set((state) => {
      if (!state.productVariants) return {};

      return {
        productVariants: state.productVariants.includes(item)
          ? state.productVariants
          : [...state.productVariants, item],
      };
    });
  },

  updateProductVariant: (data) => {
    set((state) => {
      if (!state.productVariants) return {};

      let changed = false;

      const updated = state.productVariants.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { productVariants: updated } : {};
    });
  },

  deleteProductVariant: (data) => {
    set((state) => {
      if (!state.productVariants) return {};

      const exists = state.productVariants.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        productVariants: state.productVariants.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteProductVariants: (data) => {
    set((state) => {
      if (!state.productVariants) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        productVariants: state.productVariants.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
