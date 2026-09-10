'use client';

import { create } from 'zustand';
import type { TableGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type TablesValue = TableGet[] | null | undefined;

interface TableState {
  tables: TablesValue;
  deleted: TableGet[];
  setTables: (data: TablesValue) => void;
  setDeletedTables: (data: TablesValue) => void;
  clearTables: () => void;
  clearDeletedTables: () => void;
  addTable: (data: TableGet) => void;
  updateTable: (data: TableGet) => void;
  mergeTables: (data: TableGet[]) => void;
  deleteTable: (data: TableGet) => void;
}

export const useStoreTable = create<TableState>((set) => ({
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

  addTable: (data) => {
    set((state) => ({
      tables: [...(state.tables ?? []), data],
    }));
  },

  updateTable: (data) => {
    set((state) => ({
      tables: state.tables?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeTables: (incomingTables) => {
    set((state) => {
      if (!incomingTables || incomingTables.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.tables) {
        return { tables: incomingTables };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingTables.map((n) => [String(n.id), n]));

      // 1. Update existing tables in place if fields differ
      const nextTables = state.tables.map((existing) => {
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

      // 2. Append new tables that aren't in the store yet
      const existingIds = new Set(state.tables.map((n) => String(n.id)));
      for (const incoming of incomingTables) {
        if (!existingIds.has(String(incoming.id))) {
          nextTables.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { tables: nextTables };
    });
  },

  deleteTable: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      tables: state.tables?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
