import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { OrderItemGet } from '@repo/types/models/order-item';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useOrderItemActions = () => {
  const { session } = useStoreSession();
  const { addOrderItem, updateOrderItem, deleteOrderItem } =
    useStoreOrderItem();

  const orderItemCreate = (params: Partial<OrderItemGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newOrderItem: OrderItemGet = {
      id: params.id || id,
      order_id: params.order_id || '',
      price_at_sale: params.price_at_sale || 0,
      product_variant_id: params.product_variant_id || '',
      profile_id: session.id || '',
      quantity: params.quantity || 0,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addOrderItem(newOrderItem);
  };

  const orderItemUpdate = (params: OrderItemGet) => {
    if (!session) return;

    const now = new Date();

    const newOrderItem: OrderItemGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateOrderItem(newOrderItem);
  };

  const orderItemDelete = (params: OrderItemGet) => {
    if (!session) return;

    const now = new Date();

    deleteOrderItem({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { orderItemCreate, orderItemUpdate, orderItemDelete };
};
