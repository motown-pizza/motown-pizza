import { create } from 'zustand';
import { OrderRelations } from '@repo/types/models/order';

export type OrderDetailsValue = OrderRelations | null | undefined;

interface OrderDetailsState {
  orderDetails: OrderDetailsValue;
  setOrderDetails: (data: OrderDetailsValue) => void;
  clearOrderDetails: () => void;
}

export const useStoreOrderDetails = create<OrderDetailsState>((set) => ({
  orderDetails: undefined,

  setOrderDetails: (data) => {
    set({ orderDetails: data });
  },

  clearOrderDetails: () => {
    set({ orderDetails: undefined });
  },
}));
