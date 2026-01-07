import { create } from 'zustand';
import type { OrderGet } from '@repo/types/models/order';

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
  deleteOrder: (data: OrderGet) => void;
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
      orders:
        state.orders?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteOrder: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      orders: state.orders?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
