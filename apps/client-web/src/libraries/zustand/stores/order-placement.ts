import { create } from 'zustand';
import { OrderGet } from '@repo/types/models/order';

export type OrderDetailsValue = OrderGet | null | undefined;

interface OrderDetailsState {
  orderDetails: OrderDetailsValue;
  setOrderDetails: (data: OrderDetailsValue) => void;
  clearOrderDetails: () => void;
}

export const useStoreOrderPlacement = create<OrderDetailsState>((set) => ({
  orderDetails: undefined,

  setOrderDetails: (data) => {
    set({ orderDetails: data });
  },

  clearOrderDetails: () => {
    set({ orderDetails: undefined });
  },
}));
