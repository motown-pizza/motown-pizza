import { create } from 'zustand';
import type { IngredientGet } from '@repo/types/models/ingredient';

export type IngredientsValue = IngredientGet[] | null | undefined;

interface IngredientState {
  ingredients: IngredientsValue;
  deleted: IngredientGet[];
  setIngredients: (data: IngredientsValue) => void;
  setDeletedIngredients: (data: IngredientsValue) => void;
  clearIngredients: () => void;
  clearDeletedIngredients: () => void;
  addIngredient: (data: IngredientGet) => void;
  updateIngredient: (data: IngredientGet) => void;
  deleteIngredient: (data: IngredientGet) => void;
}

export const useStoreIngredient = create<IngredientState>((set) => ({
  ingredients: undefined,
  deleted: [],

  setIngredients: (data) => {
    set({ ingredients: data });
  },

  setDeletedIngredients: (data) => {
    set({ deleted: data || [] });
  },

  clearIngredients: () => {
    set({ ingredients: [] });
  },

  clearDeletedIngredients: () => {
    set({ deleted: [] });
  },

  addIngredient: (data) => {
    set((state) => ({
      ingredients: [...(state.ingredients ?? []), data],
    }));
  },

  updateIngredient: (data) => {
    set((state) => ({
      ingredients:
        state.ingredients?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteIngredient: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      ingredients: state.ingredients?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
