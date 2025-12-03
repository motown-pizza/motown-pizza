import { VariantGet } from '@repo/types/models/variant';
import { create } from 'zustand';
// import type { VariantRelations } from '@repo/types/models/variant';

export type VariantsValue = VariantGet[] | null | undefined;

interface VariantState {
  variants: VariantsValue;
  deleted: VariantGet[];
  setVariants: (data: VariantsValue) => void;
  setDeletedVariants: (data: VariantsValue) => void;
  clearVariants: () => void;
  clearDeletedVariants: () => void;
  addVariant: (data: VariantGet) => void;
  updateVariant: (data: VariantGet) => void;
  deleteVariant: (data: VariantGet) => void;
}

export const useStoreVariant = create<VariantState>((set) => ({
  variants: undefined,
  deleted: [],

  setVariants: (data) => {
    set({ variants: data });
  },

  setDeletedVariants: (data) => {
    set({ deleted: data || [] });
  },

  clearVariants: () => {
    set({ variants: [] });
  },

  clearDeletedVariants: () => {
    set({ deleted: [] });
  },

  addVariant: (data) => {
    set((state) => ({
      variants: [...(state.variants ?? []), data],
    }));
  },

  updateVariant: (data) => {
    set((state) => ({
      variants:
        state.variants?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteVariant: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      variants: state.variants?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
