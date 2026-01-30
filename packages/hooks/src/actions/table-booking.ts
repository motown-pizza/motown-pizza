import { useStoreTableBooking } from '@repo/libraries/zustand/stores/table-booking';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { TableBookingGet } from '@repo/types/models/table-booking';
import {
  Status,
  SyncStatus,
  TableBookingStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';
import { useStoreTable } from '@repo/libraries/zustand/stores/table';

export const useTableBookingActions = () => {
  const { session } = useStoreSession();
  const { tables } = useStoreTable();
  const { addTableBooking, updateTableBooking, deleteTableBooking } =
    useStoreTableBooking();
  const { showNotification } = useNotification();

  const tableBookingCreate = (params: Partial<TableBookingGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newTableBooking: TableBookingGet = {
      id: params.id || id,
      table_booking_status:
        params.table_booking_status || TableBookingStatus.WAITING,
      number_of_persons: params.number_of_persons || 1,
      table_id: params.table_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addTableBooking(newTableBooking);

    const table = tables?.find((t) => t.id == params.table_id);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Booking Booked',
      desc: `Table ${table?.table_number} has been booked`,
    });
  };

  const tableBookingUpdate = (params: TableBookingGet) => {
    if (!session) return;

    const now = new Date();

    const newTableBooking: TableBookingGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateTableBooking(newTableBooking);

    const table = tables?.find((t) => t.id == params.table_id);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Booking Updated',
      desc: `Table ${table?.table_number}'s booking has been updated`,
    });
  };

  const tableBookingDelete = (params: TableBookingGet) => {
    if (!session) return;

    const now = new Date();

    deleteTableBooking({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { tableBookingCreate, tableBookingUpdate, tableBookingDelete };
};
