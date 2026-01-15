import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { DeliveryGet } from '@repo/types/models/delivery';
import {
  DeliveryStatus,
  Status,
  SyncStatus,
  TransportVehicleType,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';
import { generateRecipientPin } from '@repo/services/logic/generators/order-code';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';

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
      delivered_at: params.delivered_at || null,
      delivery_fee: params.delivery_fee || 0,
      delivery_status: params.delivery_status || DeliveryStatus.PENDING,
      dispatched_at: params.dispatched_at || null,
      distance_km: params.distance_km || 0,
      estimated_delivery_at: params.estimated_delivery_at || null,
      failed_at: params.failed_at || null,
      order_id: params.order_id || '',
      previous_delivery_id: params.previous_delivery_id || '',
      profile_id: params.profile_id || '',
      scheduled_date: params.scheduled_date || null,
      scheduled_window_start: params.scheduled_window_start || null,
      status_reason: params.status_reason || '',
      vehicle_id: params.vehicle_id || '',
      vehicle_type: params.vehicle_type || TransportVehicleType.MOPED,
      verfication_code: params.verfication_code || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    const order = orders.find((o) => o.id == newDelivery.order_id);

    if (!order) {
      showNotification({
        variant: Variant.FAILED,
        title: 'Order Not Found',
        desc: `Couldn't find the order for this delivery.`,
      });

      return;
    }

    const recipientPin = await generateRecipientPin(order.tracking_code);

    addDelivery({ ...newDelivery, verfication_code: recipientPin });

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
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateDelivery(newDelivery);
    showNotification({
      variant: Variant.SUCCESS,
      title: 'Delivery Updated',
      desc: `The delivery has been updated`,
    });
  };

  const deliveryDelete = (params: DeliveryGet) => {
    if (!session) return;

    const now = new Date();

    deleteDelivery({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { deliveryCreate, deliveryUpdate, deliveryDelete };
};
