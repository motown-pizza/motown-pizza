import { create } from 'zustand';
import type { TransporterGet } from '@repo/types/models/transporter';

export type TransportersValue = TransporterGet[] | null | undefined;

interface TransporterState {
  transporters: TransportersValue;
  deleted: TransporterGet[];
  setTransporters: (data: TransportersValue) => void;
  setDeletedTransporters: (data: TransportersValue) => void;
  clearTransporters: () => void;
  clearDeletedTransporters: () => void;
  addTransporter: (data: TransporterGet) => void;
  updateTransporter: (data: TransporterGet) => void;
  deleteTransporter: (data: TransporterGet) => void;
}

export const useStoreTransporter = create<TransporterState>((set) => ({
  transporters: undefined,
  deleted: [],

  setTransporters: (data) => {
    set({ transporters: data });
  },

  setDeletedTransporters: (data) => {
    set({ deleted: data || [] });
  },

  clearTransporters: () => {
    set({ transporters: [] });
  },

  clearDeletedTransporters: () => {
    set({ deleted: [] });
  },

  addTransporter: (data) => {
    set((state) => ({
      transporters: [...(state.transporters ?? []), data],
    }));
  },

  updateTransporter: (data) => {
    set((state) => ({
      transporters:
        state.transporters?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteTransporter: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      transporters: state.transporters?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
