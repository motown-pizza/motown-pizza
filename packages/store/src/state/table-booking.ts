'use client';

import { create } from 'zustand';
import type { TableBookingGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type TableBookingsValue = TableBookingGet[] | null | undefined;

interface TableBookingState {
  tableBookings: TableBookingsValue;
  deleted: TableBookingGet[];
  setTableBookings: (data: TableBookingsValue) => void;
  setDeletedTableBookings: (data: TableBookingsValue) => void;
  clearTableBookings: () => void;
  clearDeletedTableBookings: () => void;
  addTableBooking: (data: TableBookingGet) => void;
  updateTableBooking: (data: TableBookingGet) => void;
  mergeTableBookings: (data: TableBookingGet[]) => void;
  deleteTableBooking: (data: TableBookingGet) => void;
}

export const useStoreTableBooking = create<TableBookingState>((set) => ({
  tableBookings: undefined,
  deleted: [],

  setTableBookings: (data) => {
    set({ tableBookings: data });
  },

  setDeletedTableBookings: (data) => {
    set({ deleted: data || [] });
  },

  clearTableBookings: () => {
    set({ tableBookings: [] });
  },

  clearDeletedTableBookings: () => {
    set({ deleted: [] });
  },

  addTableBooking: (data) => {
    set((state) => ({
      tableBookings: [...(state.tableBookings ?? []), data],
    }));
  },

  updateTableBooking: (data) => {
    set((state) => ({
      tableBookings:
        state.tableBookings?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeTableBookings: (incomingTableBookings) => {
    set((state) => {
      if (!incomingTableBookings || incomingTableBookings.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.tableBookings) {
        return { tableBookings: incomingTableBookings };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingTableBookings.map((n) => [String(n.id), n]));

      // 1. Update existing tableBookings in place if fields differ
      const nextTableBookings = state.tableBookings.map((existing) => {
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

      // 2. Append new tableBookings that aren't in the store yet
      const existingIds = new Set(state.tableBookings.map((n) => String(n.id)));
      for (const incoming of incomingTableBookings) {
        if (!existingIds.has(String(incoming.id))) {
          nextTableBookings.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { tableBookings: nextTableBookings };
    });
  },

  deleteTableBooking: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      tableBookings: state.tableBookings?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
