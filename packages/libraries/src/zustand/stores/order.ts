import { OrderGet } from '@repo/types/models/order';
import { create } from 'zustand';
// import type { OrdersRelations } from '@repo/types/models/cart';

export type OrdersValue = OrderGet[] | null | undefined;

interface OrdersState {
  orders: OrdersValue;
  deleted: OrderGet[];
  setOrders: (data: OrdersValue) => void;
  setDeletedOrders: (data: OrdersValue) => void;
  clearOrders: () => void;
  clearDeletedOrders: () => void;
  addOrder: (data: OrderGet) => void;
  updateOrder: (data: OrderGet) => void;
  deleteOrder: (data: OrderGet) => void;
  deleteOrders: (data: OrderGet[]) => void;
}

export const useStoreOrder = create<OrdersState>((set) => ({
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

  addOrder: (item) => {
    set((state) => {
      if (!state.orders) return {};

      return {
        orders: state.orders.includes(item)
          ? state.orders
          : [...state.orders, item],
      };
    });
  },

  updateOrder: (data) => {
    set((state) => {
      if (!state.orders) return {};

      let changed = false;

      const updated = state.orders.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { orders: updated } : {};
    });
  },

  deleteOrder: (data) => {
    set((state) => {
      if (!state.orders) return {};

      const exists = state.orders.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        orders: state.orders.filter((i) => i.id !== data.id),
      };
    });
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
