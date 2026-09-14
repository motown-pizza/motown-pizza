'use client';

import { useStoreDelivery } from '../delivery';
import { useStoreSession } from '../session';
import { useStoreOrder } from '../order';
import { DeliveryGet } from '@repo/types';
import {
  DeliveryStatus,
  OrderFulfilmentType,
  Status,
  SyncStatus,
  TransportVehicleType,
} from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';
import { generateRecipientPin } from '@repo/utils';

export const useDeliveryActions = () => {
  const { session } = useStoreSession();
  const { orders } = useStoreOrder();
  const { addDelivery, updateDelivery, deleteDelivery } = useStoreDelivery();
  const { showNotification } = useNotification();

  const deliveryCreate = async (params: Partial<DeliveryGet>) => {
    if (!session) return;
    if (!orders) return;

    const id = generateUUID();
    const now = new Date();

    const newDelivery: DeliveryGet = {
      id: params.id || id,
      deliveredAt: params.deliveredAt || null,
      deliveryFee: params.deliveryFee || 0,
      deliveryStatus: params.deliveryStatus || DeliveryStatus.PENDING,
      dispatchedAt: params.dispatchedAt || null,
      distanceKm: params.distanceKm || 0,
      estimatedDeliveryAt: params.estimatedDeliveryAt || null,
      failedAt: params.failedAt || null,
      orderId: params.orderId || '',
      previousDeliveryId: params.previousDeliveryId || '',
      profileId: session.email ? session.id : null,
      scheduledDate: params.scheduledDate || null,
      scheduledWindowStart: params.scheduledWindowStart || null,
      statusReason: params.statusReason || '',
      vehicleId: params.vehicleId || '',
      vehicleType: params.vehicleType || TransportVehicleType.MOPED,
      verficationCode: params.verficationCode || '',
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    const order = orders.find((o) => o.id == newDelivery.orderId);

    if (!order) {
      showNotification({
        variant: Variant.FAILED,
        title: 'Order Not Found',
        desc: `Couldn't find the order for this delivery.`,
      });

      return;
    }

    let recipientPin: string = '';

    if (order.fulfillmentType == OrderFulfilmentType.DELIVERY) {
      recipientPin = await generateRecipientPin(order.trackingCode);
    }

    addDelivery({ ...newDelivery, verficationCode: recipientPin });

    // showNotification({
    //   variant: Variant.SUCCESS,
    //   title: 'Delivery Added',
    //   desc: `The delivery has been added`,
    // });
  };

  const deliveryUpdate = (params: DeliveryGet) => {
    if (!session) return;

    const now = new Date();

    const newDelivery: DeliveryGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateDelivery(newDelivery);

    // showNotification({
    //   variant: Variant.SUCCESS,
    //   title: 'Delivery Updated',
    //   desc: `The delivery has been updated`,
    // });
  };

  const deliveryDelete = (params: DeliveryGet) => {
    if (!session) return;

    const now = new Date();

    deleteDelivery({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { deliveryCreate, deliveryUpdate, deliveryDelete };
};
