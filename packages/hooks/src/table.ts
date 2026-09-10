'use client';

import { TableBookingsValue, useStoreTableBooking } from '@repo/store';
import { TableBookingStatus } from '@repo/types';
import { TableGet } from '@repo/types';

export const useTableStatus = (params: { table: TableGet }) => {
  const { tableBookings } = useStoreTableBooking();

  return getTableStatus({
    table: params.table,
    tableBookings,
  });
};

export const getTableStatus = (params: { table: TableGet; tableBookings: TableBookingsValue }) => {
  const { table, tableBookings } = params;

  const tableBookingsCurrent = tableBookings?.filter((tb) => tb.tableId == table.id);

  const isOccupied = tableBookingsCurrent?.some(
    (tb) =>
      tb.tableBookingStatus == TableBookingStatus.WAITING ||
      tb.tableBookingStatus == TableBookingStatus.RECEIVED,
  );

  const isBooked = tableBookingsCurrent?.some(
    (tb) => tb.tableBookingStatus == TableBookingStatus.BOOKED,
  );

  return {
    isOccupied,
    isBooked,
  };
};
