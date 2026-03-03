import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { getUrlParam } from '@repo/utilities/url';
import { useEffect } from 'react';

export const useOrderPlacementData = () => {
  const { orders } = useStoreOrder();
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();

  useEffect(() => {
    if (orders === undefined) return;
    if (orders === null) return;
    if (orderDetails?.customer_name) return;

    const orderCurrentId = getUrlParam('orderId');
    if (!orderCurrentId) return;

    const orderFound = orders?.find((oi) => oi.id == orderCurrentId);
    if (!orderFound) return;

    setOrderDetails({ ...orderDetails, ...orderFound });
  }, [orders, orderDetails, setOrderDetails]);

  return { orderDetails };
};
