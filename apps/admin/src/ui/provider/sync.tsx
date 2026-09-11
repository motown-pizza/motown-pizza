'use client';

import React from 'react';
import { useDebouncedCallback, useNetwork } from '@mantine/hooks';
import {
  useStoreSession,
  useStoreSyncStatus,
  handleMergedSync,
  MergedSyncPayload,
  syncToServerAfterDelay,
  useMergedSync,
} from '@repo/store';
import { API_URL, BASE_URL, STORE_NAME } from '@repo/constants';

export function ProviderSync({ children }: { children: React.ReactNode }) {
  const networkStatus = useNetwork();

  const session = useStoreSession((s) => s.session);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const setSyncStatus = useStoreSyncStatus((s) => s.setSyncStatus);

  // This now handles a MergedSyncPayload rather than one store's SyncParams
  const debounceMergedSyncToServer = useDebouncedCallback(syncToServerAfterDelay, 500);

  const restProps = {
    setSyncStatus,
    session,
    networkStatus,
    syncStatus,
    debounceMergedSyncToServer,
    clientOnly: false,
  };

  useMergedSync({
    syncStatus: restProps.syncStatus,
    online: networkStatus.online,
    // Use an array of keys for stability in the hook's dependency array
    storesToSync: STORES_TO_SYNC,
    // The payload (i) passed here is now the MergedSyncPayload { notes, categories }
    handleSync: (payload: MergedSyncPayload) =>
      handleMergedSync({ payload, ...restProps, apiUrl: API_URL }),
  });

  return <div>{children}</div>;
}

const STORES_TO_SYNC = [
  STORE_NAME.PROFILES,
  STORE_NAME.PRODUCTS,
  STORE_NAME.PRODUCT_VARIANTS,
  STORE_NAME.INGREDIENTS,
  STORE_NAME.RECIPIE_ITEMS,
  STORE_NAME.ORDERS,
  STORE_NAME.ORDER_ITEMS,
  STORE_NAME.STOCK_MOVEMENTS,
  STORE_NAME.DELIVERIES,
  STORE_NAME.TABLES,
  STORE_NAME.TABLE_BOOKINGS,
];
