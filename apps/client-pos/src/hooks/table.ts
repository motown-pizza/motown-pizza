import {
  TableBookingsValue,
  useStoreTableBooking,
} from '@repo/libraries/zustand/stores/table-booking';
import { TableBookingStatus } from '@repo/types/models/enums';
import { TableGet } from '@repo/types/models/table';

export const useTableStatus = (params: { table: TableGet }) => {
  const { tableBookings } = useStoreTableBooking();

  return getTableStatus({
    table: params.table,
    tableBookings,
  });
};

export const getTableStatus = (params: {
  table: TableGet;
  tableBookings: TableBookingsValue;
}) => {
  const { table, tableBookings } = params;

  const tableBookingsCurrent = tableBookings?.filter(
    (tb) => tb.table_id == table.id
  );

  const isOccupied = tableBookingsCurrent?.some(
    (tb) =>
      tb.table_booking_status == TableBookingStatus.WAITING ||
      tb.table_booking_status == TableBookingStatus.RECEIVED
  );

  const isBooked = tableBookingsCurrent?.some(
    (tb) => tb.table_booking_status == TableBookingStatus.BOOKED
  );

  return {
    isOccupied,
    isBooked,
  };
};
