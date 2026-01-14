import { IngredientGet } from '@repo/types/models/ingredient';
import { create } from 'zustand';
// import type { IngredientsRelations } from '@repo/types/models/cart';

export type IngredientsValue = IngredientGet[] | null | undefined;

interface IngredientsState {
  ingredients: IngredientsValue;
  deleted: IngredientGet[];
  setIngredients: (data: IngredientsValue) => void;
  setDeletedIngredients: (data: IngredientsValue) => void;
  clearIngredients: () => void;
  clearDeletedIngredients: () => void;
  addIngredient: (data: IngredientGet) => void;
  updateIngredient: (data: IngredientGet) => void;
  deleteIngredient: (data: IngredientGet) => void;
  deleteIngredients: (data: IngredientGet[]) => void;
}

export const useStoreIngredient = create<IngredientsState>((set) => ({
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

  addIngredient: (item) => {
    set((state) => {
      if (!state.ingredients) return {};

      return {
        ingredients: state.ingredients.includes(item)
          ? state.ingredients
          : [...state.ingredients, item],
      };
    });
  },

  updateIngredient: (data) => {
    set((state) => {
      if (!state.ingredients) return {};

      let changed = false;

      const updated = state.ingredients.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { ingredients: updated } : {};
    });
  },

  deleteIngredient: (data) => {
    set((state) => {
      if (!state.ingredients) return {};

      const exists = state.ingredients.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        ingredients: state.ingredients.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteIngredients: (data) => {
    set((state) => {
      if (!state.ingredients) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        ingredients: state.ingredients.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
