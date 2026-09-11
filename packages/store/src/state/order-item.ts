'use client';

import { create } from 'zustand';
import type { OrderItemGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type OrderItemsValue = OrderItemGet[] | null | undefined;

interface OrderItemState {
  orderItems: OrderItemsValue;
  deleted: OrderItemGet[];
  setOrderItems: (data: OrderItemsValue) => void;
  setDeletedOrderItems: (data: OrderItemsValue) => void;
  clearOrderItems: () => void;
  clearDeletedOrderItems: () => void;
  addOrderItem: (data: OrderItemGet) => void;
  updateOrderItem: (data: OrderItemGet) => void;
  mergeOrderItems: (data: OrderItemGet[]) => void;
  deleteOrderItem: (data: OrderItemGet) => void;
}

export const useStoreOrderItem = create<OrderItemState>((set) => ({
  orderItems: undefined,
  deleted: [],

  setOrderItems: (data) => {
    set({ orderItems: data });
  },

  setDeletedOrderItems: (data) => {
    set({ deleted: data || [] });
  },

  clearOrderItems: () => {
    set({ orderItems: [] });
  },

  clearDeletedOrderItems: () => {
    set({ deleted: [] });
  },

  addOrderItem: (data) => {
    set((state) => ({
      orderItems: [...(state.orderItems ?? []), data],
    }));
  },

  updateOrderItem: (data) => {
    set((state) => ({
      orderItems: state.orderItems?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeOrderItems: (incomingOrderItems) => {
    set((state) => {
      if (!incomingOrderItems || incomingOrderItems.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.orderItems) {
        return { orderItems: incomingOrderItems };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingOrderItems.map((n) => [String(n.id), n]));

      // 1. Update existing orderItems in place if fields differ
      const nextOrderItems = state.orderItems.map((existing) => {
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

      // 2. Append new orderItems that aren't in the store yet
      const existingIds = new Set(state.orderItems.map((n) => String(n.id)));
      for (const incoming of incomingOrderItems) {
        if (!existingIds.has(String(incoming.id))) {
          nextOrderItems.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { orderItems: nextOrderItems };
    });
  },

  deleteOrderItem: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      orderItems: state.orderItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
