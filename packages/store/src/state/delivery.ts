'use client';

import { create } from 'zustand';
import type { DeliveryGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type DeliveriesValue = DeliveryGet[] | null | undefined;

interface DeliveryState {
  deliveries: DeliveriesValue;
  deleted: DeliveryGet[];
  setDeliveries: (data: DeliveriesValue) => void;
  setDeletedDeliveries: (data: DeliveriesValue) => void;
  clearDeliveries: () => void;
  clearDeletedDeliveries: () => void;
  addDelivery: (data: DeliveryGet) => void;
  updateDelivery: (data: DeliveryGet) => void;
  mergeDeliveries: (data: DeliveryGet[]) => void;
  deleteDelivery: (data: DeliveryGet) => void;
}

export const useStoreDelivery = create<DeliveryState>((set) => ({
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

  addDelivery: (data) => {
    set((state) => ({
      deliveries: [...(state.deliveries ?? []), data],
    }));
  },

  updateDelivery: (data) => {
    set((state) => ({
      deliveries: state.deliveries?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeDeliveries: (incomingDeliveries) => {
    set((state) => {
      if (!incomingDeliveries || incomingDeliveries.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.deliveries) {
        return { deliveries: incomingDeliveries };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingDeliveries.map((n) => [String(n.id), n]));

      // 1. Update existing deliveries in place if fields differ
      const nextDeliveries = state.deliveries.map((existing) => {
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

      // 2. Append new deliveries that aren't in the store yet
      const existingIds = new Set(state.deliveries.map((n) => String(n.id)));
      for (const incoming of incomingDeliveries) {
        if (!existingIds.has(String(incoming.id))) {
          nextDeliveries.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { deliveries: nextDeliveries };
    });
  },

  deleteDelivery: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      deliveries: state.deliveries?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
