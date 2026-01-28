'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { useDebouncedCallback, useNetwork } from '@mantine/hooks';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import { handleSync, syncToServerAfterDelay } from '@/utilities/sync';
import {
  useSyncIngredients,
  useSyncOrderItems,
  useSyncOrders,
  useSyncProducts,
  useSyncProductVariants,
  useSyncRecipieItems,
  useSyncTableBookings,
  useSyncTables,
} from '@repo/hooks/sync';
import { SyncParams } from '@repo/types/sync';
import { useSyncQueue } from '@repo/utilities/sync';

export default function Sync({ children }: { children: React.ReactNode }) {
  const networkStatus = useNetwork();

  const { session } = useStoreSession();
  const { syncStatus, setSyncStatus } = useStoreSyncStatus();

  const enqueueSync = useSyncQueue({ syncFunction: handleSync });

  const debounceSyncToServer = useDebouncedCallback(
    syncToServerAfterDelay,
    500
  );

  const restProps = {
    setSyncStatus,
    session,
    networkStatus,
    syncStatus,
    debounceSyncToServer,
    clientOnly: false,
  };

  // useSyncProfiles({
  //   syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
  //   online: networkStatus.online,
  // });

  useSyncProducts({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useSyncProductVariants({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useSyncIngredients({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useSyncRecipieItems({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useSyncOrders({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useSyncOrderItems({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  // useSyncStockMovements({
  //   syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
  //   online: networkStatus.online,
  // });

  // useSyncDeliveries({
  //   syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
  //   online: networkStatus.online,
  // });

  useSyncTables({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useSyncTableBookings({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  return <div>{children}</div>;
}
