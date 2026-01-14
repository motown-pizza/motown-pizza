import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { create } from 'zustand';
// import type { RecipieItemsRelations } from '@repo/types/models/recipie';

export type RecipieItemsValue = RecipieItemGet[] | null | undefined;

interface RecipieItemsState {
  recipieItems: RecipieItemsValue;
  deleted: RecipieItemGet[];
  setRecipieItems: (data: RecipieItemsValue) => void;
  setDeletedRecipieItems: (data: RecipieItemsValue) => void;
  clearRecipieItems: () => void;
  clearDeletedRecipieItems: () => void;
  addRecipieItem: (data: RecipieItemGet) => void;
  updateRecipieItem: (data: RecipieItemGet) => void;
  deleteRecipieItem: (data: RecipieItemGet) => void;
  deleteRecipieItems: (data: RecipieItemGet[]) => void;
}

export const useStoreRecipieItem = create<RecipieItemsState>((set) => ({
  recipieItems: undefined,
  deleted: [],

  setRecipieItems: (data) => {
    set({ recipieItems: data });
  },

  setDeletedRecipieItems: (data) => {
    set({ deleted: data || [] });
  },

  clearRecipieItems: () => {
    set({ recipieItems: [] });
  },

  clearDeletedRecipieItems: () => {
    set({ deleted: [] });
  },

  addRecipieItem: (item) => {
    set((state) => {
      if (!state.recipieItems) return {};

      return {
        recipieItems: state.recipieItems.includes(item)
          ? state.recipieItems
          : [...state.recipieItems, item],
      };
    });
  },

  updateRecipieItem: (data) => {
    set((state) => {
      if (!state.recipieItems) return {};

      let changed = false;

      const updated = state.recipieItems.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { recipieItems: updated } : {};
    });
  },

  deleteRecipieItem: (data) => {
    set((state) => {
      if (!state.recipieItems) return {};

      const exists = state.recipieItems.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        recipieItems: state.recipieItems.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteRecipieItems: (data) => {
    set((state) => {
      if (!state.recipieItems) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        recipieItems: state.recipieItems.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
