import { OrderItemGet } from '@repo/types/models/order-item';
import { create } from 'zustand';
// import type { OrderItemsRelations } from '@repo/types/models/order';

export type OrderItemsValue = OrderItemGet[] | null | undefined;

interface OrderItemsState {
  orderItems: OrderItemsValue;
  deleted: OrderItemGet[];
  setOrderItems: (data: OrderItemsValue) => void;
  setDeletedOrderItems: (data: OrderItemsValue) => void;
  clearOrderItems: () => void;
  clearDeletedOrderItems: () => void;
  addOrderItem: (data: OrderItemGet) => void;
  updateOrderItem: (data: OrderItemGet) => void;
  deleteOrderItem: (data: OrderItemGet) => void;
  deleteOrderItems: (data: OrderItemGet[]) => void;
}

export const useStoreOrderItem = create<OrderItemsState>((set) => ({
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

  addOrderItem: (item) => {
    set((state) => {
      if (!state.orderItems) return {};

      return {
        orderItems: state.orderItems.includes(item)
          ? state.orderItems
          : [...state.orderItems, item],
      };
    });
  },

  updateOrderItem: (data) => {
    set((state) => {
      if (!state.orderItems) return {};

      let changed = false;

      const updated = state.orderItems.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { orderItems: updated } : {};
    });
  },

  deleteOrderItem: (data) => {
    set((state) => {
      if (!state.orderItems) return {};

      const exists = state.orderItems.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        orderItems: state.orderItems.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteOrderItems: (data) => {
    set((state) => {
      if (!state.orderItems) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        orderItems: state.orderItems.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
