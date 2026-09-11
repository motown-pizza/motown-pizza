'use client';

import { create } from 'zustand';
import type { OrderGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type OrdersValue = OrderGet[] | null | undefined;

interface OrderState {
  orders: OrdersValue;
  deleted: OrderGet[];
  setOrders: (data: OrdersValue) => void;
  setDeletedOrders: (data: OrdersValue) => void;
  clearOrders: () => void;
  clearDeletedOrders: () => void;
  addOrder: (data: OrderGet) => void;
  updateOrder: (data: OrderGet) => void;
  mergeOrders: (data: OrderGet[]) => void;
  deleteOrder: (data: OrderGet) => void;
  deleteOrders: (data: OrderGet[]) => void;
}

export const useStoreOrder = create<OrderState>((set) => ({
  orders: undefined,
  deleted: [],

  setOrders: (data) => {
    set({ orders: data });
  },

  setDeletedOrders: (data) => {
    set({ deleted: data || [] });
  },

  clearOrders: () => {
    set({ orders: [] });
  },

  clearDeletedOrders: () => {
    set({ deleted: [] });
  },

  addOrder: (data) => {
    set((state) => ({
      orders: [...(state.orders ?? []), data],
    }));
  },

  updateOrder: (data) => {
    set((state) => ({
      orders: state.orders?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeOrders: (incomingOrders) => {
    set((state) => {
      if (!incomingOrders || incomingOrders.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.orders) {
        return { orders: incomingOrders };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingOrders.map((n) => [String(n.id), n]));

      // 1. Update existing orders in place if fields differ
      const nextOrders = state.orders.map((existing) => {
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

      // 2. Append new orders that aren't in the store yet
      const existingIds = new Set(state.orders.map((n) => String(n.id)));
      for (const incoming of incomingOrders) {
        if (!existingIds.has(String(incoming.id))) {
          nextOrders.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { orders: nextOrders };
    });
  },

  deleteOrder: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      orders: state.orders?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },

  deleteOrders: (data) => {
    set((state) => {
      if (!state.orders) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        orders: state.orders.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
