'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React, { useEffect } from 'react';
import { useDebouncedCallback, useNetwork } from '@mantine/hooks';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@/libraries/zustand/stores/sync-status';
import { handleSync, syncToServerAfterDelay } from '@/utilities/sync';
import {
  useSyncCategories,
  useSyncIngredients,
  useSyncOrderItems,
  useSyncOrders,
  useSyncPosts,
  useSyncProducts,
  useSyncProductVariants,
  useSyncProfiles,
  useSyncRecipieItems,
  useSyncStockMovements,
  useSyncTransporters,
} from '@/hooks/sync';
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

  const { syncProfiles } = useSyncProfiles({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncPosts } = useSyncPosts({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncCategories } = useSyncCategories({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncProducts } = useSyncProducts({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncProductVariants } = useSyncProductVariants({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncIngredients } = useSyncIngredients({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncRecipieItems } = useSyncRecipieItems({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncOrders } = useSyncOrders({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncOrderItems } = useSyncOrderItems({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncStockMovements } = useSyncStockMovements({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncTransporters } = useSyncTransporters({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useEffect(() => {
    if (!networkStatus.online) return;

    syncProfiles();
    syncPosts();
    syncCategories();
    syncProducts();
    syncProductVariants();
    syncIngredients();
    syncRecipieItems();
    syncOrders();
    syncOrderItems();
    syncStockMovements();
    syncTransporters();
  }, [
    networkStatus.online,
    syncProfiles,
    syncPosts,
    syncCategories,
    syncProducts,
    syncProductVariants,
    syncIngredients,
    syncRecipieItems,
    syncOrders,
    syncOrderItems,
    syncStockMovements,
    syncTransporters,
  ]);

  return <div>{children}</div>;
}
