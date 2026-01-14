import { create } from 'zustand';
import type { StockMovementGet } from '@repo/types/models/stock-movement';

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
  deleteStockMovement: (data: StockMovementGet) => void;
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
        state.stockMovements?.map((i) =>
          i.id === data.id ? { ...data } : i
        ) ?? undefined,
    }));
  },

  deleteStockMovement: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      stockMovements:
        state.stockMovements?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
