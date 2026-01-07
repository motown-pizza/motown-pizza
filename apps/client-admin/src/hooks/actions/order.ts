import { useStoreOrder } from '@/libraries/zustand/stores/order';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { OrderGet } from '@repo/types/models/order';
import {
  OrderFulfilmentType,
  OrderPaymentStatus,
  OrderSource,
  OrderStatus,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useOrderActions = () => {
  const { session } = useStoreSession();
  const { addOrder, updateOrder, deleteOrder } = useStoreOrder();

  const orderCreate = (params: Partial<OrderGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newOrder: OrderGet = {
      id: params.id || id,
      customer_name: params.customer_name || '',
      customer_phone: params.customer_phone || '',
      eta_estimate: params.eta_estimate || '',
      fulfillment_type: params.fulfillment_type || OrderFulfilmentType.DELIVERY,
      order_payment_status:
        params.order_payment_status || OrderPaymentStatus.PENDING,
      order_status: params.order_status || OrderStatus.PROCESSING,
      source: params.source || OrderSource.WEBSITE,
      store_id: params.store_id || '',
      transporter_id: params.transporter_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addOrder(newOrder);
  };

  const orderUpdate = (params: OrderGet) => {
    if (!session) return;

    const now = new Date();

    const newOrder: OrderGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateOrder(newOrder);
  };

  const orderDelete = (params: OrderGet) => {
    if (!session) return;

    const now = new Date();

    deleteOrder({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { orderCreate, orderUpdate, orderDelete };
};
