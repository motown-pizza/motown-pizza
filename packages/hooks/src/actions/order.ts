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

export const useOrderActions = () => {
  const { session } = useStoreSession();
  const { addOrder, updateOrder, deleteOrder } = useStoreOrder();

  const { orderItems, setOrderItems } = useStoreOrderItem();
  const { productVariants } = useStoreProductVariant();
  const { cartItems, deleteCartItems } = useStoreCartItem();

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
      order_time: params.order_time || OrderTime.NOW,
      payment_method: params.payment_method || OrderPaymentMethod.ONLINE,
      profile_id: session.id || '',
      source: params.source || OrderSource.POS,
      store_id: params.store_id || '',
      transporter_id: params.transporter_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addOrder(newOrder);

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

    deleteCartItems(
      (cartItems || []).map((ci) => {
        return {
          ...ci,
          sync_status: SyncStatus.DELETED,
          updated_at: now.toISOString() as any,
        };
      })
    );
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
