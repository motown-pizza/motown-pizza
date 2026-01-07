import { create } from 'zustand';
import type { StoreGet } from '@repo/types/models/store';

export type StoresValue = StoreGet[] | null | undefined;

interface StoreState {
  stores: StoresValue;
  deleted: StoreGet[];
  setStores: (data: StoresValue) => void;
  setDeletedStores: (data: StoresValue) => void;
  clearStores: () => void;
  clearDeletedStores: () => void;
  addStore: (data: StoreGet) => void;
  updateStore: (data: StoreGet) => void;
  deleteStore: (data: StoreGet) => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  stores: undefined,
  deleted: [],

  setStores: (data) => {
    set({ stores: data });
  },

  setDeletedStores: (data) => {
    set({ deleted: data || [] });
  },

  clearStores: () => {
    set({ stores: [] });
  },

  clearDeletedStores: () => {
    set({ deleted: [] });
  },

  addStore: (data) => {
    set((state) => ({
      stores: [...(state.stores ?? []), data],
    }));
  },

  updateStore: (data) => {
    set((state) => ({
      stores:
        state.stores?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteStore: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      stores: state.stores?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
