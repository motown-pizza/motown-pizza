import { CategoryGet } from '@repo/types/models/category';
import { create } from 'zustand';
// import type { CategoriesRelations } from '@repo/types/models/cart';

export type CategoriesValue = CategoryGet[] | null | undefined;

interface CategoriesState {
  categories: CategoriesValue;
  deleted: CategoryGet[];
  setCategories: (data: CategoriesValue) => void;
  setDeletedCategories: (data: CategoriesValue) => void;
  clearCategories: () => void;
  clearDeletedCategories: () => void;
  addCategory: (data: CategoryGet) => void;
  updateCategory: (data: CategoryGet) => void;
  deleteCategory: (data: CategoryGet) => void;
  deleteCategories: (data: CategoryGet[]) => void;
}

export const useStoreCategory = create<CategoriesState>((set) => ({
  categories: undefined,
  deleted: [],

  setCategories: (data) => {
    set({ categories: data });
  },

  setDeletedCategories: (data) => {
    set({ deleted: data || [] });
  },

  clearCategories: () => {
    set({ categories: [] });
  },

  clearDeletedCategories: () => {
    set({ deleted: [] });
  },

  addCategory: (item) => {
    set((state) => {
      if (!state.categories) return {};

      return {
        categories: state.categories.includes(item)
          ? state.categories
          : [...state.categories, item],
      };
    });
  },

  updateCategory: (data) => {
    set((state) => {
      if (!state.categories) return {};

      let changed = false;

      const updated = state.categories.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { categories: updated } : {};
    });
  },

  deleteCategory: (data) => {
    set((state) => {
      if (!state.categories) return {};

      const exists = state.categories.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        categories: state.categories.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteCategories: (data) => {
    set((state) => {
      if (!state.categories) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        categories: state.categories.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
