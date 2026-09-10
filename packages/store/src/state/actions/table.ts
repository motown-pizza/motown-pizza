'use client';

import { useStoreTable } from '../table';
import { useStoreSession } from '../session';
import { TableGet } from '@repo/types';
import { Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

export const useTableActions = () => {
  const { session } = useStoreSession();
  const { addTable, updateTable, deleteTable } = useStoreTable();
  const { showNotification } = useNotification();

  const tableCreate = (params: Partial<TableGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newTable: TableGet = {
      id: params.id || id,
      seatCount: params.seatCount || 0,
      tableNumber: params.tableNumber || '',
      // tableStatus: params.tableStatus || TableStatus.AVAILABLE,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addTable(newTable);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Added',
      desc: `Table '${newTable.tableNumber}' has been added`,
    });
  };

  const tableUpdate = (params: TableGet) => {
    if (!session) return;

    const now = new Date();

    const newTable: TableGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateTable(newTable);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Updated',
      desc: `'${newTable.tableNumber}' has been updated`,
    });
  };

  const tableDelete = (params: TableGet) => {
    if (!session) return;

    const now = new Date();

    deleteTable({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { tableCreate, tableUpdate, tableDelete };
};
