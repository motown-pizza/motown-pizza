import { create } from 'zustand';
import type { OrderItemGet } from '@repo/types/models/order-item';

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
      orderItems:
        state.orderItems?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteOrderItem: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      orderItems:
        state.orderItems?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
