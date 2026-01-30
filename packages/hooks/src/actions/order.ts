import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { OrderGet } from '@repo/types/models/order';
import {
  OrderPaymentMethod,
  OrderStatus,
  OrderTime,
  OrderFulfilmentType,
  Status,
  SyncStatus,
  OrderPaymentStatus,
  OrderSource,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { OrderItemGet } from '@repo/types/models/order-item';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { generateTrackingCode } from '@repo/services/logic/generators/order-code';
import { StoreGet } from '@repo/constants/stores';
import { useDeliveryActions } from './delivery';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';

export const useOrderActions = () => {
  const { session } = useStoreSession();
  const { addOrder, updateOrder, deleteOrder } = useStoreOrder();
  const { orderItems, setOrderItems } = useStoreOrderItem();
  const { productVariants } = useStoreProductVariant();
  const { cartItems, deleteCartItems } = useStoreCartItem();
  const { deliveryCreate } = useDeliveryActions();

  const orderCreate = async (
    params: Partial<OrderGet>,
    options: { stores: StoreGet[] }
  ) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newOrder: OrderGet = {
      id: params.id || id,
      customer_name: params.customer_name || '',
      customer_phone: params.customer_phone || '',
      eta_estimate: params.eta_estimate || '',
      fulfillment_type: params.fulfillment_type || OrderFulfilmentType.DELIVERY,
      guest_count: params.guest_count || 0,
      order_payment_status:
        params.order_payment_status || OrderPaymentStatus.PENDING,
      order_status: params.order_status || OrderStatus.PROCESSING,
      order_time: params.order_time || OrderTime.NOW,
      payment_method: params.payment_method || OrderPaymentMethod.ONLINE,
      profile_id: session.id || null,
      source: params.source || OrderSource.POS,
      store_id: params.store_id || null,
      tracking_code: params.tracking_code || '',
      table_booking_id: params.table_booking_id || null,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    const trackingCode = await generateTrackingCode({
      date: new Date(newOrder.created_at),
      deliveryType: newOrder.fulfillment_type,
      hashInput: newOrder.id,
      storeTitle:
        options.stores.find((s) => s.id == newOrder.store_id)?.title || 'GEN',
    });

    const orderToAdd = { ...newOrder, tracking_code: trackingCode };

    addOrder(orderToAdd);

    return orderToAdd;
  };

  const orderUpdate = (params: OrderGet, options?: { placement?: boolean }) => {
    if (!session) return;

    const now = new Date();

    const newOrder: OrderGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateOrder(newOrder);

    if (options?.placement) {
      const cartToOrderItems: OrderItemGet[] = (cartItems || []).map((ci) => {
        const productVariant = productVariants?.find(
          (pv) => pv.id == ci.product_variant_id
        );

        return {
          id: generateUUID(),
          order_id: newOrder.id,
          price_at_sale: (productVariant?.price || 0) * ci.quantity,
          product_variant_id: productVariant?.id || '',
          profile_id: session.id || '',
          quantity: ci.quantity,
          status: ci.status || Status.ACTIVE,
          sync_status: SyncStatus.PENDING,
          created_at: now.toISOString() as any,
          updated_at: now.toISOString() as any,
        };
      });

      setOrderItems([...(orderItems || []), ...cartToOrderItems]);

      if (newOrder.fulfillment_type == OrderFulfilmentType.DELIVERY) {
        deliveryCreate({ order_id: newOrder.id });
      }

      deleteCartItems(
        (cartItems || []).map((ci) => {
          return {
            ...ci,
            sync_status: SyncStatus.DELETED,
            updated_at: now.toISOString() as any,
          };
        })
      );
    }
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
