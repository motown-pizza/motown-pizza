'use client';

import { useStoreTableBooking } from '../table-booking';
import { useStoreSession } from '../session';
import { TableBookingGet } from '@repo/types';
import { Status, SyncStatus, TableBookingStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';
import { useStoreTable } from '../table';

export const useTableBookingActions = () => {
  const { session } = useStoreSession();
  const { tables } = useStoreTable();
  const { addTableBooking, updateTableBooking, deleteTableBooking } = useStoreTableBooking();
  const { showNotification } = useNotification();

  const tableBookingCreate = (params: Partial<TableBookingGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newTableBooking: TableBookingGet = {
      id: params.id || id,
      tableBookingStatus: params.tableBookingStatus || TableBookingStatus.WAITING,
      numberOfPersons: params.numberOfPersons || 1,
      tableId: params.tableId || '',
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addTableBooking(newTableBooking);

    const table = tables?.find((t) => t.id == params.tableId);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Booking Booked',
      desc: `Table ${table?.tableNumber} has been booked`,
    });
  };

  const tableBookingUpdate = (params: TableBookingGet) => {
    if (!session) return;

    const now = new Date();

    const newTableBooking: TableBookingGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateTableBooking(newTableBooking);

    const table = tables?.find((t) => t.id == params.tableId);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Booking Updated',
      desc: `Table ${table?.tableNumber}'s booking has been updated`,
    });
  };

  const tableBookingDelete = (params: TableBookingGet) => {
    if (!session) return;

    const now = new Date();

    deleteTableBooking({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { tableBookingCreate, tableBookingUpdate, tableBookingDelete };
};
