import { OrderGet } from '@repo/types';
import { stores } from '@repo/constants';
import {
  OrderFulfilmentType,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderSource,
  OrderStatus,
  OrderTime,
  Status,
  SyncStatus,
} from '@repo/types';

const now = new Date();

export const defaultOrderDetails: OrderGet = {
  id: 'new',
  customerName: '',
  customerPhone: '',
  etaEstimate: '',
  fulfillmentType: OrderFulfilmentType.DELIVERY,
  guestCount: 0,
  orderPaymentStatus: OrderPaymentStatus.PENDING,
  orderStatus: OrderStatus.DRAFT,
  orderTime: OrderTime.NOW,
  paymentMethod: OrderPaymentMethod.ONLINE,
  profileId: null,
  source: OrderSource.WEBSITE,
  storeId: stores?.[0]?.id ?? null,
  trackingCode: '',
  status: Status.ACTIVE,
  syncStatus: SyncStatus.SYNCED,
  tableBookingId: null,
  createdAt: now,
  updatedAt: now,
};
