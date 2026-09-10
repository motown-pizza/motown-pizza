'use client';

import { create } from 'zustand';
import type { IngredientGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeIngredients: (data: IngredientGet[]) => void;
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
      ingredients: state.ingredients?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeIngredients: (incomingIngredients) => {
    set((state) => {
      if (!incomingIngredients || incomingIngredients.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.ingredients) {
        return { ingredients: incomingIngredients };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingIngredients.map((n) => [String(n.id), n]));

      // 1. Update existing ingredients in place if fields differ
      const nextIngredients = state.ingredients.map((existing) => {
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

      // 2. Append new ingredients that aren't in the store yet
      const existingIds = new Set(state.ingredients.map((n) => String(n.id)));
      for (const incoming of incomingIngredients) {
        if (!existingIds.has(String(incoming.id))) {
          nextIngredients.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { ingredients: nextIngredients };
    });
  },

  deleteIngredient: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      ingredients: state.ingredients?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
