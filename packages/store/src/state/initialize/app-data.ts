'use client';

import { useEffect } from 'react';
import { STORE_NAME } from '@repo/constants';
import { SessionValue, useStoreSession } from '../session';
import { openDatabase } from '../../indexed-db/actions';
import { config } from '../../indexed-db/config';
import { FileSyncAdapter, SyncStatus } from '@repo/types';
import { useStoreCartItem } from '../cart-item';
import { useStoreCategory } from '../category';
import { useStoreDelivery } from '../delivery';
import { useStoreIngredient } from '../ingredient';
import { useStoreOrderItem } from '../order-item';
import { useStoreOrder } from '../order';
import { useStorePost } from '../post';
import { useStoreProductVariant } from '../product-variant';
import { useStoreProduct } from '../product';
import { useStoreProfile } from '../profile';
import { useStoreRecipieItem } from '../recipie-item';
import { useStoreStockMovement } from '../stock-movement';
import { useStoreTableBooking } from '../table-booking';
import { useStoreTable } from '../table';
import { useStoreWishlistItem } from '../wishlist-item';

const mergeItems = async (
  dataStore: string,
  clientItems: any[],
  serverItems: any[],
): Promise<any[]> => {
  const db = await openDatabase(config);

  // 1. Identify items the server says are deleted
  const serverDeletedItems = serverItems
    .filter((item) => item.syncStatus === SyncStatus.DELETED)
    .map((item) => ({ id: item.id })); // Wrap in object to satisfy your helper's 'item[actualKeyPath]'

  const serverDeletedIds = serverDeletedItems.map((i) => i.id);

  // 2. Remove those IDs from IndexedDB immediately to ensure consistency
  if (serverDeletedItems.length > 0) {
    await db.delete(dataStore, serverDeletedItems);
  }

  // 3. Filter client items: remove what server deleted + what client marked deleted
  const activeClientItems = clientItems.filter(
    (item) => !serverDeletedIds.includes(item.id) && item.syncStatus !== SyncStatus.DELETED,
  );

  const mergedMap = new Map(activeClientItems.map((item) => [item.id, item]));

  // 4. Merge Server updates
  serverItems.forEach((serverItem) => {
    if (serverItem.syncStatus === SyncStatus.DELETED) return;

    const localItem = mergedMap.get(serverItem.id);
    const serverTime = new Date(serverItem.updatedAt).getTime();
    const localTime = localItem ? new Date(localItem.updatedAt).getTime() : 0;

    // Update if local doesn't exist OR server is strictly newer
    if (!localItem || serverTime > localTime) {
      mergedMap.set(serverItem.id, {
        ...serverItem,
        syncStatus: SyncStatus.SYNCED,
        updatedAt: new Date(serverItem.updatedAt).toISOString(),
      });
    }
  });

  return Array.from(mergedMap.values());
};

const loadInitialData = async (params: {
  dataStore: string;
  session: SessionValue;
  serverItems: any[];
  options?: { clientOnly?: boolean; fileSyncAdapter?: FileSyncAdapter };
  stateUpdateFunction: (items: any[]) => void;
}) => {
  const { clientOnly, fileSyncAdapter } = params.options || {};
  const { session, dataStore, serverItems, stateUpdateFunction } = params;

  try {
    const db = await openDatabase(config);
    let clientItems: any[] = (await db.get(dataStore)) || [];

    // 1. Attach profileId for offline-created items if session exists
    if (session?.id) {
      clientItems = clientItems.map((i) => ({
        ...i,
        profileId: i.profileId || session.id,
      }));
    }

    let combinedItems: any[] = [];

    // 2. Scenario A: Local-Only Mode (Filesystem Backup or Pure Local)
    if (clientOnly) {
      let source = clientItems;
      if (fileSyncAdapter) {
        const bundle = await fileSyncAdapter.readBackup();
        source = bundle?.[dataStore.toLowerCase()] || clientItems;
      }
      // Filter out items the user deleted locally while offline
      combinedItems = source.filter((i) => i.syncStatus !== SyncStatus.DELETED);
    }

    // 3. Scenario B: Server-Sync Mode
    else {
      if (clientItems.length === 0 && serverItems.length > 0) {
        // First-time sync (Cold start)
        combinedItems = serverItems
          .filter((item) => item.syncStatus !== SyncStatus.DELETED)
          .map((item) => ({
            ...item,
            updatedAt: new Date(item.updatedAt).toISOString(),
          }));
      } else {
        // Standard Reconcile (The logic that fixes your multi-device lag)
        combinedItems = await mergeItems(dataStore, clientItems, serverItems);
      }
    }

    // 4. Persistence: Sync the Merged State back to IndexedDB
    // We use .put to ensure the local DB is an exact mirror of our merged logic
    await db.put(dataStore, combinedItems);

    // 5. Update UI State (Zustand)
    stateUpdateFunction(combinedItems);
  } catch (error) {
    console.error(`Sync error for ${dataStore}:`, error);
  }
};

type LoadStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  setState: (store: THookReturn, items: TItems[]) => void;
};

export const LOAD_STORES: Record<string, LoadStoreConfig> = {
  [STORE_NAME.CART_ITEMS]: {
    dataStore: STORE_NAME.CART_ITEMS,
    useStoreHook: useStoreCartItem,
    setState: (store, items) => store.setCartItems(items),
  },
  [STORE_NAME.CATEGORIES]: {
    dataStore: STORE_NAME.CATEGORIES,
    useStoreHook: useStoreCategory,
    setState: (store, items) => store.setCategories(items),
  },
  [STORE_NAME.DELIVERIES]: {
    dataStore: STORE_NAME.DELIVERIES,
    useStoreHook: useStoreDelivery,
    setState: (store, items) => store.setDeliveries(items),
  },
  [STORE_NAME.INGREDIENTS]: {
    dataStore: STORE_NAME.INGREDIENTS,
    useStoreHook: useStoreIngredient,
    setState: (store, items) => store.setIngredients(items),
  },
  [STORE_NAME.ORDER_ITEMS]: {
    dataStore: STORE_NAME.ORDER_ITEMS,
    useStoreHook: useStoreOrderItem,
    setState: (store, items) => store.setOrderItems(items),
  },
  [STORE_NAME.ORDERS]: {
    dataStore: STORE_NAME.ORDERS,
    useStoreHook: useStoreOrder,
    setState: (store, items) => store.setOrders(items),
  },
  [STORE_NAME.POSTS]: {
    dataStore: STORE_NAME.POSTS,
    useStoreHook: useStorePost,
    setState: (store, items) => store.setPosts(items),
  },
  [STORE_NAME.PRODUCT_VARIANTS]: {
    dataStore: STORE_NAME.PRODUCT_VARIANTS,
    useStoreHook: useStoreProductVariant,
    setState: (store, items) => store.setProductVariants(items),
  },
  [STORE_NAME.PRODUCTS]: {
    dataStore: STORE_NAME.PRODUCTS,
    useStoreHook: useStoreProduct,
    setState: (store, items) => store.setProducts(items),
  },
  [STORE_NAME.PROFILES]: {
    dataStore: STORE_NAME.PROFILES,
    useStoreHook: useStoreProfile,
    setState: (store, items) => store.setProfiles(items),
  },
  [STORE_NAME.RECIPIE_ITEMS]: {
    dataStore: STORE_NAME.RECIPIE_ITEMS,
    useStoreHook: useStoreRecipieItem,
    setState: (store, items) => store.setRecipieItems(items),
  },
  [STORE_NAME.STOCK_MOVEMENTS]: {
    dataStore: STORE_NAME.STOCK_MOVEMENTS,
    useStoreHook: useStoreStockMovement,
    setState: (store, items) => store.setStockMovements(items),
  },
  [STORE_NAME.TABLE_BOOKINGS]: {
    dataStore: STORE_NAME.TABLE_BOOKINGS,
    useStoreHook: useStoreTableBooking,
    setState: (store, items) => store.setTableBookings(items),
  },
  [STORE_NAME.TABLES]: {
    dataStore: STORE_NAME.TABLES,
    useStoreHook: useStoreTable,
    setState: (store, items) => store.setTables(items),
  },
  [STORE_NAME.WISHLIST_ITEMS]: {
    dataStore: STORE_NAME.WISHLIST_ITEMS,
    useStoreHook: useStoreWishlistItem,
    setState: (store, items) => store.setWishlistItems(items),
  },
} as const;

type LoadStoreKey = keyof typeof LOAD_STORES;

export const useLoadAppData = (options: {
  apiUrl: string;
  storesToLoad: Partial<Record<LoadStoreKey, boolean>>;
  clientOnly?: boolean;
}) => {
  const session = useStoreSession((s) => s.session);

  const stores = {
    [STORE_NAME.CART_ITEMS]: useStoreCartItem(),
    [STORE_NAME.CATEGORIES]: useStoreCategory(),
    [STORE_NAME.DELIVERIES]: useStoreDelivery(),
    [STORE_NAME.INGREDIENTS]: useStoreIngredient(),
    [STORE_NAME.ORDER_ITEMS]: useStoreOrderItem(),
    [STORE_NAME.ORDERS]: useStoreOrder(),
    [STORE_NAME.POSTS]: useStorePost(),
    [STORE_NAME.PRODUCT_VARIANTS]: useStoreProductVariant(),
    [STORE_NAME.PRODUCTS]: useStoreProduct(),
    [STORE_NAME.PROFILES]: useStoreProfile(),
    [STORE_NAME.RECIPIE_ITEMS]: useStoreRecipieItem(),
    [STORE_NAME.STOCK_MOVEMENTS]: useStoreStockMovement(),
    [STORE_NAME.TABLE_BOOKINGS]: useStoreTableBooking(),
    [STORE_NAME.TABLES]: useStoreTable(),
    [STORE_NAME.WISHLIST_ITEMS]: useStoreWishlistItem(),
  };

  useEffect(() => {
    if (!session?.id) return;

    const syncAll = async () => {
      try {
        // 1. Identify which keys are set to 'true'
        const activeStoreKeys = (Object.keys(options.storesToLoad) as LoadStoreKey[]).filter(
          (key) => options.storesToLoad[key],
        );

        if (activeStoreKeys.length === 0) return;

        // 2. Fetch only the required data
        // Pass the requested stores as a query param so the server can optimize
        const storeQuery = activeStoreKeys.join(',');

        const res = await fetch(
          `${options.apiUrl}/app-data?userId=${session.id}&stores=${storeQuery}`,
        );

        if (!res.ok) {
          const errorText = await res.text().catch(() => 'No response body');

          throw new Error(
            `Failed to fetch app data (${res.status} ${res.statusText}): ${errorText}`,
          );
        }

        const fullPayload = await res.json();

        // 2. Process each store in parallel (only the active stores)
        const syncPromises = activeStoreKeys.map(async (key) => {
          const config = LOAD_STORES[key];
          const serverData = fullPayload[key] || [];
          const storeInstance = stores[key as keyof typeof stores];

          if (!config || !storeInstance) return;

          return loadInitialData({
            dataStore: config.dataStore,
            session,
            options: { clientOnly: options.clientOnly },
            serverItems: serverData,
            stateUpdateFunction: (items) => config.setState(storeInstance, items),
          });
        });

        await Promise.all(syncPromises);
      } catch (e) {
        console.error('Data initialization failed:', e);
      }
    };

    syncAll();
  }, [session?.id, JSON.stringify(options.storesToLoad), options.clientOnly]);
};
