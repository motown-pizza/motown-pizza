'use client';

import { create } from 'zustand';
import { OrderGet } from '@repo/types';
import { defaultOrderDetails } from '@repo/constants';

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
    set({ orderDetails: defaultOrderDetails });
  },
}));
