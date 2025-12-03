import { OrderRelations } from '@repo/types/models/order';
import { stores } from './stores';
import {
  OrderPaymentOption,
  OrderStage,
  OrderTime,
  OrderType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';

const now = new Date();

export const defaultOrderDetails: OrderRelations = {
  _count: { products: 0 },
  id: '1',
  type: OrderType.DELIVERY,
  time: OrderTime.NOW,
  stage: OrderStage.STORE,
  name: '',
  phone: '',
  email: '',
  store_id: stores[0].id,
  payment_option: OrderPaymentOption.E_CASH,
  products: [],
  status: Status.ACTIVE,
  sync_status: SyncStatus.SYNCED,
  created_at: now,
  updated_at: now,
};
