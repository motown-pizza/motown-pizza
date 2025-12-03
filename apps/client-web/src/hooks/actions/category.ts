import { useStoreOrder } from '@/libraries/zustand/stores/order';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { OrderRelations } from '@repo/types/models/order';
import {
  OrderPaymentOption,
  OrderStage,
  OrderTime,
  OrderType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useOrderActions = () => {
  const { session } = useStoreSession();
  const { addOrder, updateOrder, deleteOrder } = useStoreOrder();

  const orderCreate = (params: Partial<OrderRelations>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newOrder: OrderRelations = {
      id: params.id || id,
      type: params.type || OrderType.DELIVERY,
      time: params.time || OrderTime.NOW,
      stage: params.stage || OrderStage.CHECKOUT,
      payment_option: params.payment_option || OrderPaymentOption.E_CASH,
      name: params.name || '',
      email: params.email || '',
      phone: params.phone || '',
      store_id: params.store_id || '',
      products: params.products || [],
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
      _count: { products: params.products?.length || 0 },
    };

    addOrder(newOrder);
  };

  const orderUpdate = (params: OrderRelations) => {
    if (!session) return;

    const now = new Date();

    const newOrder: OrderRelations = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateOrder(newOrder);
  };

  const orderDelete = (params: OrderRelations) => {
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
