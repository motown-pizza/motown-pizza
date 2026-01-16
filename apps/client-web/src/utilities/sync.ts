import { config } from '@/libraries/indexed-db';
import { openDatabase } from '@repo/libraries/indexed-db/actions';
import { SyncStatus } from '@repo/types/models/enums';
import { SyncItem, SyncParams } from '@repo/types/sync';
import { DatabaseError } from '@repo/libraries/indexed-db/transactions';
import { SyncStatusValue } from '@repo/libraries/zustand/stores/sync-status';
import { SessionValue } from '@repo/libraries/zustand/stores/session';
import { UserNetworkReturnValue } from '@mantine/hooks';

export const syncToServerAfterDelay = async (
  params: SyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    clientOnly?: boolean;
  }
) => {
  const { setSyncStatus, networkStatus, ...syncParams } = params;

  try {
    const db = await openDatabase(config);
    const clientDbItems: any[] | undefined = await db.get(syncParams.dataStore);

    const serverItems = await syncToServerDB({
      ...syncParams,
      items: clientDbItems || [],
    });

    if (!clientDbItems) return;

    if (serverItems?.errorItems) {
      // update the client DB items' to error status
      await syncToClientDB({
        ...syncParams,
        online: networkStatus.online,
        items: serverItems.errorItems.map((ei) => {
          const clientDbItem =
            clientDbItems.find((cdi) => cdi.id === ei.id) || ei;
          return {
            ...clientDbItem,
            sync_status: SyncStatus.ERROR,
          };
        }),
        options: { fromServer: true },
      });

      setSyncStatus(SyncStatus.ERROR);

      return;
    }

    if (serverItems?.updatedItems) {
      // update the client DB items' to synced status
      await syncToClientDB({
        ...syncParams,
        online: networkStatus.online,
        cleanup: true, // cleanup deleted items
        items: serverItems.updatedItems.map((ui) => {
          const clientDbItem =
            clientDbItems.find((cdi) => cdi.id === ui.id) || ui;
          return {
            ...clientDbItem,
            sync_status: ui.sync_status,
          };
        }),
        options: { fromServer: true },
      });

      setSyncStatus(SyncStatus.SYNCED);
    }

    if (params.deletedItems?.length) {
      params.stateUpdateFunctionDeleted();
    }
  } catch (error) {
    console.error('Sync to Server Error:', (error as Error).message);
  }
};

export const handleSync = async (
  params: SyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    debounceSyncToServer: (...args: any) => void;
    clientOnly?: boolean;
  }
) => {
  const {
    setSyncStatus,
    session,
    networkStatus,
    debounceSyncToServer,
    clientOnly,
    ...syncParams
  } = params;

  if (params.syncStatus == SyncStatus.PENDING) return;

  try {
    const isOnline = networkStatus.online;

    const { hasPendingItems, hasDeletedItems, hasSavedItems, hasErrorItems } =
      await triggerClientSync({
        ...params,
        online: isOnline,
      });

    if (hasPendingItems || hasDeletedItems) {
      setSyncStatus(SyncStatus.PENDING);

      // update the client DB with pending items
      await syncToClientDB({ ...syncParams, online: isOnline, sameDate: true });

      if (params.clientOnly) {
        if (params.deletedItems?.length) {
          params.stateUpdateFunctionDeleted();
        }

        setSyncStatus(SyncStatus.SAVED);
      }
    }

    // sync to the server if online and signed in and not client only
    if (isOnline && session && !clientOnly) {
      if (
        hasPendingItems ||
        hasDeletedItems ||
        hasSavedItems ||
        hasErrorItems
      ) {
        // Start/restart debounce timer
        debounceSyncToServer(params);
      }
    }
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
    console.error('Sync Error:', (error as Error).message);
  }
};

export const triggerClientSync = async (
  params: SyncParams & {
    clientOnly?: any;
    online: boolean;
  }
) => {
  const db = await openDatabase(config);
  const clientDbItems: any[] | undefined = await db.get(params.dataStore);

  const hasDeletedItems = (() => {
    if (!params.deletedItems?.length) return false;

    return !!params.deletedItems.find((di) => {
      const deletedItem = clientDbItems?.find((cdi) => cdi.id === di.id);
      if (!deletedItem) return false;

      const clientDbItemNotDeleted =
        deletedItem.sync_status != SyncStatus.DELETED;

      if (params.clientOnly) {
        return clientDbItemNotDeleted;
      } else {
        return (
          clientDbItemNotDeleted ||
          clientDbItems?.some((cdi) => cdi.sync_status == SyncStatus.DELETED)
        );
      }
    });
  })();

  let hasPendingItems: boolean = false;

  hasPendingItems = params.items.some(
    (i) => i.sync_status == SyncStatus.PENDING
  );

  let hasSavedItems: boolean = false;
  let hasErrorItems: boolean = false;

  if (params.online) {
    hasSavedItems = params.items.some((i) => i.sync_status == SyncStatus.SAVED);
    hasErrorItems = params.items.some((i) => i.sync_status == SyncStatus.ERROR);
  }

  return { hasPendingItems, hasSavedItems, hasDeletedItems, hasErrorItems };
};

export const syncToServerDB = async (
  params: SyncParams
): Promise<void | { updatedItems?: SyncItem[]; errorItems?: SyncItem[] }> => {
  const syncedItems = params.items.filter(
    (p) => p.sync_status == SyncStatus.SYNCED
  );

  const unsyncedItems = [
    ...params.items,
    ...(params.deletedItems || []),
  ].filter((p) => p.sync_status != SyncStatus.SYNCED);

  const now = new Date();

  try {
    // Prepare updated items for syncing
    const updatedI = unsyncedItems.map((item) => {
      return {
        ...item,
        updated_at: now,
        sync_status:
          item.sync_status == SyncStatus.DELETED
            ? SyncStatus.DELETED
            : SyncStatus.SYNCED,
      };
    });

    // Sync with server DB
    await params.serverUpdateFunction(
      updatedI,
      (params.deletedItems || []).map((i) => i.id)
    );

    return { updatedItems: [...updatedI, ...syncedItems] };
  } catch (error) {
    // Mark items as error if sync fails
    const errorI = unsyncedItems.map((item) => {
      return { ...item, updated_at: now, sync_status: SyncStatus.ERROR };
    });

    console.error('Sync to Server Error:', (error as Error).message);

    return { errorItems: errorI };
  }
};

export const syncToClientDB = async (
  params: SyncParams & {
    sameDate?: boolean;
    online?: boolean;
    cleanup?: boolean;
    options?: { fromServer?: boolean };
  }
) => {
  if (params.options?.fromServer) {
    params.items = dedupeBy(params.items, (i) => i.id);
    params.deletedItems = dedupeBy(params.deletedItems || [], (i) => i.id);
  }

  const syncedItems = params.items.filter(
    (p) => p.sync_status == SyncStatus.SYNCED
  );

  const unsyncedItems = [
    ...params.items,
    ...(params.options?.fromServer ? [] : params.deletedItems || []),
  ].filter((p) => p.sync_status != SyncStatus.SYNCED);

  try {
    const db = await openDatabase(config);

    // Update IndexedDB with unsynced items items

    let savedItems: any[] = params.options?.fromServer ? params.items : [];

    if (unsyncedItems.length) {
      savedItems = unsyncedItems.map((item) => {
        return {
          ...item,
          updated_at: params.sameDate
            ? item.updated_at
            : new Date().toISOString(),
          sync_status:
            item.sync_status == SyncStatus.DELETED
              ? SyncStatus.DELETED
              : item.sync_status == SyncStatus.ERROR
                ? SyncStatus.ERROR
                : SyncStatus.SAVED,
        };
      });
    }

    if (!savedItems.length) return;

    if (params.cleanup) {
      const deletedItems = savedItems.filter(
        (i) => i.sync_status == SyncStatus.DELETED
      );

      if (deletedItems.length) {
        // remove items with sync status DELETE from client
        await db.delete(params.dataStore, deletedItems);
      }
    }

    const savedItemsNotDeleted: any[] = savedItems.filter(
      (i) => i.sync_status != SyncStatus.DELETED
    );

    const clientDbItems = params.cleanup ? savedItemsNotDeleted : savedItems;

    const finalClientDbItems = params.options?.fromServer
      ? clientDbItems
      : [...clientDbItems, ...syncedItems];

    await db.put(params.dataStore, finalClientDbItems);

    const stateItems = params.options?.fromServer
      ? syncedItems
      : finalClientDbItems.filter((i) => i.sync_status != SyncStatus.DELETED);

    params.stateUpdateFunction(stateItems);
  } catch (error) {
    console.error('Client DB Sync Error:', (error as DatabaseError).message);
    throw error;
  }
};

function dedupeBy<T, K>(arr: T[], key: (item: T) => K): T[] {
  return Array.from(new Map(arr.map((i) => [key(i), i])).values());
}
