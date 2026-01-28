import { useStoreTable } from '@repo/libraries/zustand/stores/table';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { TableGet } from '@repo/types/models/table';
import { Status, SyncStatus, TableStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';

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
      seat_count: params.seat_count || 0,
      table_number: params.table_number || '',
      table_status: params.table_status || TableStatus.AVAILABLE,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addTable(newTable);
    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Added',
      desc: `Table '${newTable.table_number}' has been added`,
    });
  };

  const tableUpdate = (params: TableGet) => {
    if (!session) return;

    const now = new Date();

    const newTable: TableGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateTable(newTable);
    showNotification({
      variant: Variant.SUCCESS,
      title: 'Table Updated',
      desc: `'${newTable.table_number}' has been updated`,
    });
  };

  const tableDelete = (params: TableGet) => {
    if (!session) return;

    const now = new Date();

    deleteTable({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { tableCreate, tableUpdate, tableDelete };
};
