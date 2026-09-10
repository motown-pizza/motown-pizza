'use client';

import { useStoreOrderItem } from '../order-item';
import { useStoreSession } from '../session';
import { OrderItemGet } from '@repo/types';
import { Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';

export const useOrderItemActions = () => {
  const { session } = useStoreSession();
  const { addOrderItem, updateOrderItem, deleteOrderItem } = useStoreOrderItem();

  const orderItemCreate = (params: Partial<OrderItemGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newOrderItem: OrderItemGet = {
      id: params.id || id,
      orderId: params.orderId || '',
      priceAtSale: params.priceAtSale || 0,
      productVariantId: params.productVariantId || '',
      profileId: session.email ? session.id : null,
      quantity: params.quantity || 0,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addOrderItem(newOrderItem);
  };

  const orderItemUpdate = (params: OrderItemGet) => {
    if (!session) return;

    const now = new Date();

    const newOrderItem: OrderItemGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateOrderItem(newOrderItem);
  };

  const orderItemDelete = (params: OrderItemGet) => {
    if (!session) return;

    const now = new Date();

    deleteOrderItem({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { orderItemCreate, orderItemUpdate, orderItemDelete };
};
