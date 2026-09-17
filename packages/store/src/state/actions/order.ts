'use client';

import { useStoreOrder } from '../order';
import { useStoreSession } from '../session';
import { OrderGet } from '@repo/types';
import {
  OrderPaymentMethod,
  OrderStatus,
  OrderTime,
  OrderFulfilmentType,
  Status,
  SyncStatus,
  OrderPaymentStatus,
  OrderSource,
} from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreOrderItem } from '../order-item';
import { useStoreCartItem } from '../cart-item';
import { OrderItemGet } from '@repo/types';
import { useStoreProductVariant } from '../product-variant';
import { generateTrackingCode } from '@repo/utils';
import { StoreGet } from '@repo/constants';
import { useDeliveryActions } from './delivery';
import { useRouter } from 'next/navigation';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

export const useOrderActions = () => {
  const router = useRouter();
  const { session } = useStoreSession();
  const { addOrder, updateOrder, deleteOrder } = useStoreOrder();
  const { orderItems, setOrderItems } = useStoreOrderItem();
  const { productVariants } = useStoreProductVariant();
  const { cartItems, deleteCartItems } = useStoreCartItem();
  const { orders } = useStoreOrder();
  const { deliveryCreate } = useDeliveryActions();
  const { showNotification } = useNotification();

  const orderCreate = async (params: Partial<OrderGet>, options: { stores: StoreGet[] }) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newOrder: OrderGet = {
      id: params.id || id,
      customerName: params.customerName || '',
      customerPhone: params.customerPhone || '',
      etaEstimate: params.etaEstimate || '',
      fulfillmentType: params.fulfillmentType || OrderFulfilmentType.DELIVERY,
      guestCount: !params.guestCount
        ? params.fulfillmentType == OrderFulfilmentType.DINE_IN
          ? 0
          : null
        : params.guestCount,
      orderPaymentStatus: params.orderPaymentStatus || OrderPaymentStatus.PENDING,
      orderStatus: params.orderStatus || OrderStatus.PROCESSING,
      orderTime: params.orderTime || OrderTime.NOW,
      paymentMethod: params.paymentMethod || OrderPaymentMethod.ONLINE,
      profileId: session.email ? session.id : null,
      source: params.source || OrderSource.POS,
      storeId: params.storeId || null,
      trackingCode: params.trackingCode || '',
      tableBookingId: params.tableBookingId || null,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    let orderToAdd: OrderGet = newOrder;

    // if (newOrder.fulfillmentType == OrderFulfilmentType.DELIVERY) {
    const trackingCode = await generateTrackingCode({
      date: new Date(newOrder.createdAt),
      deliveryType: newOrder.fulfillmentType,
      hashInput: newOrder.id,
      storeTitle: options.stores.find((s) => s.id == newOrder.storeId)?.title || 'GEN',
    });

    orderToAdd = { ...newOrder, trackingCode: trackingCode };
    // }

    addOrder(orderToAdd);

    return orderToAdd;
  };

  const orderUpdate = (
    params: OrderGet,
    options?: { placement?: boolean },
  ): { cartToOrderItems?: OrderItemGet[] } => {
    if (!session) return {};

    const now = new Date();

    let newOrder: OrderGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    if (newOrder.id == 'new') {
      const draftOrders = orders?.filter((oi) => oi.orderStatus == OrderStatus.DRAFT);

      if (!draftOrders) {
        // error notification goes here

        router.replace('/order/select-store');
        return { cartToOrderItems: [] };
      }

      const latestDraftOrder = draftOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      newOrder = { ...newOrder, id: latestDraftOrder?.id || '' };
    }

    updateOrder(newOrder);

    if (options?.placement) {
      const cartToOrderItems: OrderItemGet[] = (cartItems || []).map((ci) => {
        const productVariant = productVariants?.find((pv) => pv.id == ci.productVariantId);

        return {
          id: generateUUID(),
          orderId: newOrder.id,
          priceAtSale: (productVariant?.price || 0) * ci.quantity,
          productVariantId: productVariant?.id || '',
          profileId: session.email ? session.id : null,
          quantity: ci.quantity,
          status: ci.status || Status.ACTIVE,
          syncStatus: SyncStatus.PENDING,
          createdAt: now.toISOString() as any,
          updatedAt: now.toISOString() as any,
        };
      });

      setOrderItems([...(orderItems || []), ...cartToOrderItems]);

      if (cartItems?.length) {
        deleteCartItems(
          (cartItems || []).map((ci) => {
            return {
              ...ci,
              syncStatus: SyncStatus.DELETED,
              updatedAt: now.toISOString() as any,
            };
          }),
        );
      }

      // if (newOrder.fulfillmentType == OrderFulfilmentType.DELIVERY) {
      deliveryCreate({ orderId: newOrder.id });
      // }

      return { cartToOrderItems };
    }

    return {};
  };

  const orderDelete = (params: OrderGet) => {
    if (!session) return;

    const now = new Date();

    deleteOrder({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { orderCreate, orderUpdate, orderDelete };
};
