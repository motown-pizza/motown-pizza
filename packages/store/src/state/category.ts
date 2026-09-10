'use client';

import { create } from 'zustand';
import type { CategoryGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type CategoriesValue = CategoryGet[] | null | undefined;

interface CategoryState {
  categories: CategoriesValue;
  deleted: CategoryGet[];
  setCategories: (data: CategoriesValue) => void;
  setDeletedCategories: (data: CategoriesValue) => void;
  clearCategories: () => void;
  clearDeletedCategories: () => void;
  addCategory: (data: CategoryGet) => void;
  updateCategory: (data: CategoryGet) => void;
  mergeCategories: (data: CategoryGet[]) => void;
  deleteCategory: (data: CategoryGet) => void;
}

export const useStoreCategory = create<CategoryState>((set) => ({
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

  addCategory: (data) => {
    set((state) => ({
      categories: [...(state.categories ?? []), data],
    }));
  },

  updateCategory: (data) => {
    set((state) => ({
      categories: state.categories?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeCategories: (incomingCategories) => {
    set((state) => {
      if (!incomingCategories || incomingCategories.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.categories) {
        return { categories: incomingCategories };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingCategories.map((n) => [String(n.id), n]));

      // 1. Update existing categories in place if fields differ
      const nextCategories = state.categories.map((existing) => {
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

      // 2. Append new categories that aren't in the store yet
      const existingIds = new Set(state.categories.map((n) => String(n.id)));
      for (const incoming of incomingCategories) {
        if (!existingIds.has(String(incoming.id))) {
          nextCategories.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { categories: nextCategories };
    });
  },

  deleteCategory: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      categories: state.categories?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
