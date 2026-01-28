import { TableBookingGet } from '@repo/types/models/table-booking';
import { create } from 'zustand';
// import type { TableBookingsRelations } from '@repo/types/models/cart';

export type TableBookingsValue = TableBookingGet[] | null | undefined;

interface TableBookingsState {
  tableBookings: TableBookingsValue;
  deleted: TableBookingGet[];
  setTableBookings: (data: TableBookingsValue) => void;
  setDeletedTableBookings: (data: TableBookingsValue) => void;
  clearTableBookings: () => void;
  clearDeletedTableBookings: () => void;
  addTableBooking: (data: TableBookingGet) => void;
  updateTableBooking: (data: TableBookingGet) => void;
  deleteTableBooking: (data: TableBookingGet) => void;
  deleteTableBookings: (data: TableBookingGet[]) => void;
}

export const useStoreTableBooking = create<TableBookingsState>((set) => ({
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

  addTableBooking: (item) => {
    set((state) => {
      if (!state.tableBookings) return {};

      return {
        tableBookings: state.tableBookings.includes(item)
          ? state.tableBookings
          : [...state.tableBookings, item],
      };
    });
  },

  updateTableBooking: (data) => {
    set((state) => {
      if (!state.tableBookings) return {};

      let changed = false;

      const updated = state.tableBookings.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { tableBookings: updated } : {};
    });
  },

  deleteTableBooking: (data) => {
    set((state) => {
      if (!state.tableBookings) return {};

      const exists = state.tableBookings.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        tableBookings: state.tableBookings.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteTableBookings: (data) => {
    set((state) => {
      if (!state.tableBookings) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        tableBookings: state.tableBookings.filter(
          (i) => !idsToDelete.has(i.id)
        ),
      };
    });
  },
}));
