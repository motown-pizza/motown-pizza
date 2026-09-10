'use client';

import { useStoreOrder } from '@repo/store';
import { useStoreOrderPlacement } from '@repo/store';
import { getUrlParam } from '@repo/utils';
import { useStoreCartItem } from '@repo/store';
import { useStoreProductVariant } from '@repo/store';
import { useEffect, useMemo, useRef, useState } from 'react';
import { generateUUID } from '@repo/utils';
import { useRouter } from 'next/navigation';
import { useOrderActions } from '@repo/store';
import { defaultOrderDetails } from '@repo/constants';
import { OrderFulfilmentType, SyncStatus } from '@repo/types';
import { OrderGet } from '@repo/types';

export const useOrderPlacementData = () => {
  const { orders } = useStoreOrder();
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();

  useEffect(() => {
    if (orders === undefined) return;
    if (orders === null) return;
    if (orderDetails?.customerName) return;

    const orderCurrentId = getUrlParam('orderId');
    if (!orderCurrentId) return;

    const orderFound = orders?.find((oi) => oi.id == orderCurrentId);
    if (!orderFound) return;

    setOrderDetails({ ...orderDetails, ...orderFound });
  }, [orders, orderDetails, setOrderDetails]);

  return { orderDetails };
};

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

type CountdownResult = {
  msRemaining: number;
  parts: TimeParts;
  percentElapsed: number;
};

export function useCountdown(target: Date, durationMinutes: number): CountdownResult {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const end = target.getTime();
    const durationMs = durationMinutes * 60 * 1000;
    const start = end - durationMs;

    const msRemaining = Math.max(end - now, 0);

    const parts: TimeParts = {
      days: Math.floor(msRemaining / (24 * 60 * 60 * 1000)),
      hours: Math.floor((msRemaining / (60 * 60 * 1000)) % 24),
      minutes: Math.floor((msRemaining / (60 * 1000)) % 60),
      seconds: Math.floor((msRemaining / 1000) % 60),
      milliseconds: msRemaining % 1000,
    };

    const total = Math.max(durationMs, 1); // avoid div-by-zero
    const elapsed = Math.min(Math.max(now - start, 0), total);
    const percentElapsed = (elapsed / total) * 100;

    return {
      msRemaining,
      parts,
      percentElapsed,
    };
  }, [target, durationMinutes, now]);
}

export const useGetSum = () => {
  const { cartItems } = useStoreCartItem();
  const { productVariants } = useStoreProductVariant();

  const getSum = () => {
    let sum = 0;

    cartItems?.map((ci) => {
      const variant = productVariants?.find((pv) => pv.id == ci.productVariantId);
      if (variant?.price) sum += variant.price * ci.quantity;
    });

    return sum;
  };

  return { getSum };
};

export const useOrderStart = (params: { storeId: string; stores: any[] }) => {
  const orderIdRef = useRef(generateUUID());
  const router = useRouter();

  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  const handleStart = async (startParams?: { fulfillmentType?: OrderFulfilmentType }) => {
    const orderObject: Partial<OrderGet> = {
      ...(orderDetails || defaultOrderDetails),
      storeId: params.storeId,
      fulfillmentType:
        startParams?.fulfillmentType || (orderDetails || defaultOrderDetails).fulfillmentType,
      id: orderIdRef.current,
      syncStatus: SyncStatus.PENDING,
    };

    const newOrder = await orderCreate(orderObject, { stores: params.stores });
    setOrderDetails({ ...orderObject, ...newOrder } as OrderGet);

    router.push('/order/select-menu?menuTab=pizzas');
  };

  return {
    orderIdRef,
    orderDetails,
    setOrderDetails,
    orderCreate,
    handleStart,
  };
};
