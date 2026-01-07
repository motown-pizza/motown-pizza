import { create } from 'zustand';
import type { RecipieItemGet } from '@repo/types/models/recipie-item';

export type RecipieItemsValue = RecipieItemGet[] | null | undefined;

interface RecipieItemState {
  recipieItems: RecipieItemsValue;
  deleted: RecipieItemGet[];
  setRecipieItems: (data: RecipieItemsValue) => void;
  setDeletedRecipieItems: (data: RecipieItemsValue) => void;
  clearRecipieItems: () => void;
  clearDeletedRecipieItems: () => void;
  addRecipieItem: (data: RecipieItemGet) => void;
  updateRecipieItem: (data: RecipieItemGet) => void;
  deleteRecipieItem: (data: RecipieItemGet) => void;
}

export const useStoreRecipieItem = create<RecipieItemState>((set) => ({
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

  addRecipieItem: (data) => {
    set((state) => ({
      recipieItems: [...(state.recipieItems ?? []), data],
    }));
  },

  updateRecipieItem: (data) => {
    set((state) => ({
      recipieItems:
        state.recipieItems?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteRecipieItem: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      recipieItems: state.recipieItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
