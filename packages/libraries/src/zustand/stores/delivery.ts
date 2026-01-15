import { DeliveryGet } from '@repo/types/models/delivery';
import { create } from 'zustand';
// import type { DeliveriesRelations } from '@repo/types/models/cart';

export type DeliveriesValue = DeliveryGet[] | null | undefined;

interface DeliveriesState {
  deliveries: DeliveriesValue;
  deleted: DeliveryGet[];
  setDeliveries: (data: DeliveriesValue) => void;
  setDeletedDeliveries: (data: DeliveriesValue) => void;
  clearDeliveries: () => void;
  clearDeletedDeliveries: () => void;
  addDelivery: (data: DeliveryGet) => void;
  updateDelivery: (data: DeliveryGet) => void;
  deleteDelivery: (data: DeliveryGet) => void;
  deleteDeliveries: (data: DeliveryGet[]) => void;
}

export const useStoreDelivery = create<DeliveriesState>((set) => ({
  deliveries: undefined,
  deleted: [],

  setDeliveries: (data) => {
    set({ deliveries: data });
  },

  setDeletedDeliveries: (data) => {
    set({ deleted: data || [] });
  },

  clearDeliveries: () => {
    set({ deliveries: [] });
  },

  clearDeletedDeliveries: () => {
    set({ deleted: [] });
  },

  addDelivery: (item) => {
    set((state) => {
      if (!state.deliveries) return {};

      return {
        deliveries: state.deliveries.includes(item)
          ? state.deliveries
          : [...state.deliveries, item],
      };
    });
  },

  updateDelivery: (data) => {
    set((state) => {
      if (!state.deliveries) return {};

      let changed = false;

      const updated = state.deliveries.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { deliveries: updated } : {};
    });
  },

  deleteDelivery: (data) => {
    set((state) => {
      if (!state.deliveries) return {};

      const exists = state.deliveries.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        deliveries: state.deliveries.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteDeliveries: (data) => {
    set((state) => {
      if (!state.deliveries) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        deliveries: state.deliveries.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
