'use client';

import { create } from 'zustand';
import type { StockMovementGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type StockMovementsValue = StockMovementGet[] | null | undefined;

interface StockMovementState {
  stockMovements: StockMovementsValue;
  deleted: StockMovementGet[];
  setStockMovements: (data: StockMovementsValue) => void;
  setDeletedStockMovements: (data: StockMovementsValue) => void;
  clearStockMovements: () => void;
  clearDeletedStockMovements: () => void;
  addStockMovement: (data: StockMovementGet) => void;
  updateStockMovement: (data: StockMovementGet) => void;
  mergeStockMovements: (data: StockMovementGet[]) => void;
  deleteStockMovement: (data: StockMovementGet) => void;
  deleteStockMovements: (data: StockMovementGet[]) => void;
}

export const useStoreStockMovement = create<StockMovementState>((set) => ({
  stockMovements: undefined,
  deleted: [],

  setStockMovements: (data) => {
    set({ stockMovements: data });
  },

  setDeletedStockMovements: (data) => {
    set({ deleted: data || [] });
  },

  clearStockMovements: () => {
    set({ stockMovements: [] });
  },

  clearDeletedStockMovements: () => {
    set({ deleted: [] });
  },

  addStockMovement: (data) => {
    set((state) => ({
      stockMovements: [...(state.stockMovements ?? []), data],
    }));
  },

  updateStockMovement: (data) => {
    set((state) => ({
      stockMovements:
        state.stockMovements?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeStockMovements: (incomingStockMovements) => {
    set((state) => {
      if (!incomingStockMovements || incomingStockMovements.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.stockMovements) {
        return { stockMovements: incomingStockMovements };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingStockMovements.map((n) => [String(n.id), n]));

      // 1. Update existing stockMovements in place if fields differ
      const nextStockMovements = state.stockMovements.map((existing) => {
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

      // 2. Append new stockMovements that aren't in the store yet
      const existingIds = new Set(state.stockMovements.map((n) => String(n.id)));
      for (const incoming of incomingStockMovements) {
        if (!existingIds.has(String(incoming.id))) {
          nextStockMovements.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { stockMovements: nextStockMovements };
    });
  },

  deleteStockMovement: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      stockMovements: state.stockMovements?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },

  deleteStockMovements: (data) => {
    set((state) => {
      if (!state.stockMovements) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        stockMovements: state.stockMovements.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
