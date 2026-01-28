import { TableGet } from '@repo/types/models/table';
import { create } from 'zustand';
// import type { TablesRelations } from '@repo/types/models/cart';

export type TablesValue = TableGet[] | null | undefined;

interface TablesState {
  tables: TablesValue;
  deleted: TableGet[];
  setTables: (data: TablesValue) => void;
  setDeletedTables: (data: TablesValue) => void;
  clearTables: () => void;
  clearDeletedTables: () => void;
  addTable: (data: TableGet) => void;
  updateTable: (data: TableGet) => void;
  deleteTable: (data: TableGet) => void;
  deleteTables: (data: TableGet[]) => void;
}

export const useStoreTable = create<TablesState>((set) => ({
  tables: undefined,
  deleted: [],

  setTables: (data) => {
    set({ tables: data });
  },

  setDeletedTables: (data) => {
    set({ deleted: data || [] });
  },

  clearTables: () => {
    set({ tables: [] });
  },

  clearDeletedTables: () => {
    set({ deleted: [] });
  },

  addTable: (item) => {
    set((state) => {
      if (!state.tables) return {};

      return {
        tables: state.tables.includes(item)
          ? state.tables
          : [...state.tables, item],
      };
    });
  },

  updateTable: (data) => {
    set((state) => {
      if (!state.tables) return {};

      let changed = false;

      const updated = state.tables.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { tables: updated } : {};
    });
  },

  deleteTable: (data) => {
    set((state) => {
      if (!state.tables) return {};

      const exists = state.tables.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        tables: state.tables.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteTables: (data) => {
    set((state) => {
      if (!state.tables) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        tables: state.tables.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
