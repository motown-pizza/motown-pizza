import { OrderGet } from '@repo/types/models/order';
import { stores } from '@repo/constants/stores';
import {
  OrderFulfilmentType,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderSource,
  OrderStatus,
  OrderTime,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

const now = new Date();

export const defaultOrderDetails: OrderGet = {
  id: generateUUID(),
  customer_name: '',
  customer_phone: '',
  eta_estimate: '',
  fulfillment_type: OrderFulfilmentType.DELIVERY,
  guest_count: 0,
  order_payment_status: OrderPaymentStatus.PENDING,
  order_status: OrderStatus.PROCESSING,
  order_time: OrderTime.NOW,
  payment_method: OrderPaymentMethod.ONLINE,
  profile_id: '',
  source: OrderSource.WEBSITE,
  store_id: stores[0].id,
  tracking_code: '',
  status: Status.ACTIVE,
  sync_status: SyncStatus.SYNCED,
  table_booking_id: '',
  created_at: now,
  updated_at: now,
};
