'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useIdle, UserNetworkReturnValue } from '@mantine/hooks';
import { config } from './indexed-db/config';
import { openDatabase } from './indexed-db/actions';
import { Database, DatabaseError } from './indexed-db/transactions';
import { SESSION_STORAGE_NAME, STORE_NAME } from '@repo/constants';
import { SyncParams, SyncStatus } from '@repo/types';
import {
  cartItemsUpdate,
  categoriesUpdate,
  deliveriesUpdate,
  ingredientsUpdate,
  orderItemsUpdate,
  ordersUpdate,
  postsUpdate,
  productsUpdate,
  productVariantsUpdate,
  profilesUpdate,
  recipieItemsUpdate,
  stockMovementsUpdate,
  tableBookingsUpdate,
  wishlistItemsUpdate,
} from '@repo/handlers';
import { SyncStatusValue } from './state/sync-status';
import { SessionValue, useStoreSession } from './state/session';
import { useStoreCartItem } from './state/cart-item';
import { useStoreCategory } from './state/category';
import { useStoreDelivery } from './state/delivery';
import { useStoreIngredient } from './state/ingredient';
import { useStoreOrderItem } from './state/order-item';
import { useStoreOrder } from './state/order';
import { useStorePost } from './state/post';
import { useStoreProductVariant } from './state/product-variant';
import { useStoreProduct } from './state/product';
import { useStoreProfile } from './state/profile';
import { useStoreRecipieItem } from './state/recipie-item';
import { useStoreStockMovement } from './state/stock-movement';
import { useStoreTableBooking } from './state/table-booking';
import { useStoreTable } from './state/table';
import { useStoreWishlistItem } from './state/wishlist-item';
import { useStoreOrderPlacement } from './state/order-placement';
import { saveToSessionStorage } from '@repo/utils';

export const useOrderPlacementSync = () => {
  const { orderDetails } = useStoreOrderPlacement.getState();

  useEffect(() => {
    if (orderDetails === undefined) return;
    if (!orderDetails) return;

    if (orderDetails.id == 'new') {
      saveToSessionStorage(SESSION_STORAGE_NAME.ORDER_PLACEMENT, null);
    } else {
      saveToSessionStorage(SESSION_STORAGE_NAME.ORDER_PLACEMENT, orderDetails);
    }
  }, [orderDetails]);
};

const useSessionCheck = () => {
  const session = useStoreSession((s) => s.session);
  const noSession =
    session === undefined || (!session && (!(session as SessionValue)?.email as any));

  return { noSession };
};

type SyncStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  serverUpdate: (apiurl: string, items: TItems[], deleted: TItems[]) => Promise<any>;
  getItems: (store: THookReturn) => TItems[];
  getDeleted: (store: THookReturn) => TItems[];
  setItems: (store: THookReturn, items: TItems[]) => void;
  clearDeleted: (store: THookReturn) => void;
};

export const SYNC_STORES: Record<string, SyncStoreConfig> = {
  [STORE_NAME.CART_ITEMS]: {
    dataStore: STORE_NAME.CART_ITEMS,
    useStoreHook: useStoreCartItem,
    serverUpdate: cartItemsUpdate,
    getItems: (store) => store.cartItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCartItems(items),
    clearDeleted: (store) => store.clearDeletedCartItems(),
  },
  [STORE_NAME.CATEGORIES]: {
    dataStore: STORE_NAME.CATEGORIES,
    useStoreHook: useStoreCategory,
    serverUpdate: categoriesUpdate,
    getItems: (store) => store.categories,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCategories(items),
    clearDeleted: (store) => store.clearDeletedCategories(),
  },
  [STORE_NAME.DELIVERIES]: {
    dataStore: STORE_NAME.DELIVERIES,
    useStoreHook: useStoreDelivery,
    serverUpdate: deliveriesUpdate,
    getItems: (store) => store.deliveries,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setDeliveries(items),
    clearDeleted: (store) => store.clearDeletedDeliveries(),
  },
  [STORE_NAME.INGREDIENTS]: {
    dataStore: STORE_NAME.INGREDIENTS,
    useStoreHook: useStoreIngredient,
    serverUpdate: ingredientsUpdate,
    getItems: (store) => store.ingredients,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setIngredients(items),
    clearDeleted: (store) => store.clearDeletedIngredients(),
  },
  [STORE_NAME.ORDER_ITEMS]: {
    dataStore: STORE_NAME.ORDER_ITEMS,
    useStoreHook: useStoreOrderItem,
    serverUpdate: orderItemsUpdate,
    getItems: (store) => store.orderItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setOrderItems(items),
    clearDeleted: (store) => store.clearDeletedOrderItems(),
  },
  [STORE_NAME.ORDERS]: {
    dataStore: STORE_NAME.ORDERS,
    useStoreHook: useStoreOrder,
    serverUpdate: ordersUpdate,
    getItems: (store) => store.orders,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setOrders(items),
    clearDeleted: (store) => store.clearDeletedOrders(),
  },
  [STORE_NAME.POSTS]: {
    dataStore: STORE_NAME.POSTS,
    useStoreHook: useStorePost,
    serverUpdate: postsUpdate,
    getItems: (store) => store.posts,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setPosts(items),
    clearDeleted: (store) => store.clearDeletedPosts(),
  },
  [STORE_NAME.PRODUCT_VARIANTS]: {
    dataStore: STORE_NAME.PRODUCT_VARIANTS,
    useStoreHook: useStoreProductVariant,
    serverUpdate: productVariantsUpdate,
    getItems: (store) => store.productVariants,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProductVariants(items),
    clearDeleted: (store) => store.clearDeletedProductVariants(),
  },
  [STORE_NAME.PRODUCTS]: {
    dataStore: STORE_NAME.PRODUCTS,
    useStoreHook: useStoreProduct,
    serverUpdate: productsUpdate,
    getItems: (store) => store.products,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProducts(items),
    clearDeleted: (store) => store.clearDeletedProducts(),
  },
  [STORE_NAME.PROFILES]: {
    dataStore: STORE_NAME.PROFILES,
    useStoreHook: useStoreProfile,
    serverUpdate: profilesUpdate,
    getItems: (store) => store.profiles,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProfiles(items),
    clearDeleted: (store) => store.clearDeletedProfiles(),
  },
  [STORE_NAME.RECIPIE_ITEMS]: {
    dataStore: STORE_NAME.RECIPIE_ITEMS,
    useStoreHook: useStoreRecipieItem,
    serverUpdate: recipieItemsUpdate,
    getItems: (store) => store.recipieItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setRecipieItems(items),
    clearDeleted: (store) => store.clearDeletedRecipieItems(),
  },
  [STORE_NAME.STOCK_MOVEMENTS]: {
    dataStore: STORE_NAME.STOCK_MOVEMENTS,
    useStoreHook: useStoreStockMovement,
    serverUpdate: stockMovementsUpdate,
    getItems: (store) => store.stockMovements,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setStockMovements(items),
    clearDeleted: (store) => store.clearDeletedStockMovements(),
  },
  [STORE_NAME.TABLE_BOOKINGS]: {
    dataStore: STORE_NAME.TABLE_BOOKINGS,
    useStoreHook: useStoreTableBooking,
    serverUpdate: tableBookingsUpdate,
    getItems: (store) => store.tableBookings,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTableBookings(items),
    clearDeleted: (store) => store.clearDeletedTableBookings(),
  },
  [STORE_NAME.TABLES]: {
    dataStore: STORE_NAME.TABLES,
    useStoreHook: useStoreTable,
    serverUpdate: tableBookingsUpdate,
    getItems: (store) => store.tables,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTables(items),
    clearDeleted: (store) => store.clearDeletedTables(),
  },
  [STORE_NAME.WISHLIST_ITEMS]: {
    dataStore: STORE_NAME.WISHLIST_ITEMS,
    useStoreHook: useStoreWishlistItem,
    serverUpdate: wishlistItemsUpdate,
    getItems: (store) => store.wishlistItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setWishlistItems(items),
    clearDeleted: (store) => store.clearDeletedWishlistItems(),
  },
} as const;

type SyncStoreKey = keyof typeof SYNC_STORES;

export const SYNC_REGISTRY: Record<SyncStoreKey, any> = {
  [STORE_NAME.CART_ITEMS]: {
    store: useStoreCartItem,
    updateState: (items: any) => useStoreCartItem.getState().mergeCartItems(items),
    clearDeleted: () => useStoreCartItem.getState().clearDeletedCartItems(),
  },
  [STORE_NAME.CATEGORIES]: {
    store: useStoreCategory,
    updateState: (items: any) => useStoreCategory.getState().mergeCategories(items),
    clearDeleted: () => useStoreCategory.getState().clearDeletedCategories(),
  },
  [STORE_NAME.DELIVERIES]: {
    store: useStoreDelivery,
    updateState: (items: any) => useStoreDelivery.getState().mergeDeliveries(items),
    clearDeleted: () => useStoreDelivery.getState().clearDeletedDeliveries(),
  },
  [STORE_NAME.INGREDIENTS]: {
    store: useStoreIngredient,
    updateState: (items: any) => useStoreIngredient.getState().mergeIngredients(items),
    clearDeleted: () => useStoreIngredient.getState().clearDeletedIngredients(),
  },
  [STORE_NAME.ORDER_ITEMS]: {
    store: useStoreOrderItem,
    updateState: (items: any) => useStoreOrderItem.getState().mergeOrderItems(items),
    clearDeleted: () => useStoreOrderItem.getState().clearDeletedOrderItems(),
  },
  [STORE_NAME.ORDERS]: {
    store: useStoreOrder,
    updateState: (items: any) => useStoreOrder.getState().mergeOrders(items),
    clearDeleted: () => useStoreOrder.getState().clearDeletedOrders(),
  },
  [STORE_NAME.POSTS]: {
    store: useStorePost,
    updateState: (items: any) => useStorePost.getState().mergePosts(items),
    clearDeleted: () => useStorePost.getState().clearDeletedPosts(),
  },
  [STORE_NAME.PRODUCT_VARIANTS]: {
    store: useStoreProductVariant,
    updateState: (items: any) => useStoreProductVariant.getState().mergeProductVariants(items),
    clearDeleted: () => useStoreProductVariant.getState().clearDeletedProductVariants(),
  },
  [STORE_NAME.PRODUCTS]: {
    store: useStoreProduct,
    updateState: (items: any) => useStoreProduct.getState().mergeProducts(items),
    clearDeleted: () => useStoreProduct.getState().clearDeletedProducts(),
  },
  [STORE_NAME.PROFILES]: {
    store: useStoreProfile,
    updateState: (items: any) => useStoreProfile.getState().mergeProfiles(items),
    clearDeleted: () => useStoreProfile.getState().clearDeletedProfiles(),
  },
  [STORE_NAME.RECIPIE_ITEMS]: {
    store: useStoreRecipieItem,
    updateState: (items: any) => useStoreRecipieItem.getState().mergeRecipieItems(items),
    clearDeleted: () => useStoreRecipieItem.getState().clearDeletedRecipieItems(),
  },
  [STORE_NAME.STOCK_MOVEMENTS]: {
    store: useStoreStockMovement,
    updateState: (items: any) => useStoreStockMovement.getState().mergeStockMovements(items),
    clearDeleted: () => useStoreStockMovement.getState().clearDeletedStockMovements(),
  },
  [STORE_NAME.TABLE_BOOKINGS]: {
    store: useStoreTableBooking,
    updateState: (items: any) => useStoreTableBooking.getState().mergeTableBookings(items),
    clearDeleted: () => useStoreTableBooking.getState().clearDeletedTableBookings(),
  },
  [STORE_NAME.TABLES]: {
    store: useStoreTable,
    updateState: (items: any) => useStoreTable.getState().mergeTables(items),
    clearDeleted: () => useStoreTable.getState().clearDeletedTables(),
  },
  [STORE_NAME.WISHLIST_ITEMS]: {
    store: useStoreWishlistItem,
    updateState: (items: any) => useStoreWishlistItem.getState().mergeWishlistItems(items),
    clearDeleted: () => useStoreWishlistItem.getState().clearDeletedWishlistItems(),
  },
};

// Define a shape for the payload
export interface MergedSyncPayload {
  [STORE_NAME.CART_ITEMS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.CATEGORIES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.DELIVERIES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.INGREDIENTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.ORDER_ITEMS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.ORDERS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.POSTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.PRODUCT_VARIANTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.PRODUCTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.PROFILES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.RECIPIE_ITEMS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.STOCK_MOVEMENTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.TABLE_BOOKINGS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.TABLES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.WISHLIST_ITEMS]?: { items: any[]; deleted: any[] };
}

// Update the MergedSyncParams to handle multiple datasets
export type MergedSyncParams = {
  apiUrl: string;
  payload: MergedSyncPayload;
  onSuccess?: (key: keyof MergedSyncPayload, updatedItems: any[]) => void;
  onClearDeleted?: (key: keyof MergedSyncPayload) => void;
};

export const useMergedSync = (params: {
  online: boolean;
  storesToSync: SyncStoreKey[];
  handleSync: (payload: MergedSyncPayload) => Promise<void>;
  syncStatus: SyncStatusValue;
}) => {
  const { online } = params;
  const idle = useIdle(4000, { events: ['keypress', 'click'] });
  const { noSession } = useSessionCheck();

  // Store params in a ref so sync always reads fresh state without re-triggering useEffect
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Ref guard to prevent concurrent sync executions
  const isSyncingRef = useRef(false);

  const triggerSync = useCallback(async () => {
    // Prevent execution if already syncing or pending
    if (isSyncingRef.current || paramsRef.current.syncStatus === SyncStatus.PENDING) {
      return;
    }

    const stores = {
      [STORE_NAME.CART_ITEMS]: useStoreCartItem.getState(),
      [STORE_NAME.CATEGORIES]: useStoreCategory.getState(),
      [STORE_NAME.DELIVERIES]: useStoreDelivery.getState(),
      [STORE_NAME.INGREDIENTS]: useStoreIngredient.getState(),
      [STORE_NAME.ORDER_ITEMS]: useStoreOrderItem.getState(),
      [STORE_NAME.ORDERS]: useStoreOrder.getState(),
      [STORE_NAME.POSTS]: useStorePost.getState(),
      [STORE_NAME.PRODUCT_VARIANTS]: useStoreProductVariant.getState(),
      [STORE_NAME.PRODUCTS]: useStoreProduct.getState(),
      [STORE_NAME.PROFILES]: useStoreProfile.getState(),
      [STORE_NAME.RECIPIE_ITEMS]: useStoreRecipieItem.getState(),
      [STORE_NAME.STOCK_MOVEMENTS]: useStoreStockMovement.getState(),
      [STORE_NAME.TABLE_BOOKINGS]: useStoreTableBooking.getState(),
      [STORE_NAME.TABLES]: useStoreTable.getState(),
      [STORE_NAME.WISHLIST_ITEMS]: useStoreWishlistItem.getState(),
    };

    const payload: MergedSyncPayload = {};
    let hasDirtyData = false;

    paramsRef.current.storesToSync.forEach((key) => {
      const config = SYNC_STORES[key];

      // Safety Check: skip if config doesn't exist for this key
      if (!config) {
        console.warn(`Sync config for hook key "${key}" is missing in SYNC_STORES.`);
        return;
      }

      const store = (stores as any)[key];
      const items = config.getItems(store) ?? [];
      const deleted = config.getDeleted(store) ?? [];

      const needsSync = items.some(
        (i) =>
          i.syncStatus === SyncStatus.PENDING ||
          i.syncStatus === SyncStatus.SAVED ||
          i.syncStatus === SyncStatus.ERROR ||
          (i.syncStatus === SyncStatus.SYNCED_CLIENT && isRecent(i.updatedAt || i.createdAt)),
      );

      if (needsSync || deleted.length > 0) {
        console.log('--> [info] syncing', key);
        (payload as any)[key] = { items, deleted };
        hasDirtyData = true;
      }
    });

    if (hasDirtyData) {
      try {
        isSyncingRef.current = true;
        await paramsRef.current.handleSync(payload);
      } finally {
        isSyncingRef.current = false;
      }
    }
  }, []);

  // Effect ONLY re-runs when idle, online, or session state actually transitions
  useEffect(() => {
    if (!noSession && idle && online) {
      triggerSync();
    }
  }, [online, noSession, idle, triggerSync]);
};

export const handleMergedSync = async (
  params: MergedSyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    debounceMergedSyncToServer: (...args: any) => void;
    clientOnly?: boolean;
  },
) => {
  const { payload, networkStatus, session, setSyncStatus, debounceMergedSyncToServer, clientOnly } =
    params;

  try {
    const db = await openDatabase(config);

    // 1. Client-Side Batch Update
    // We loop through the payload keys (e.g., ['posts', 'categories'])
    for (const [storeKey, data] of Object.entries(payload)) {
      const config = SYNC_STORES[storeKey as SyncStoreKey];
      const registry = SYNC_REGISTRY[storeKey as SyncStoreKey];

      await syncToClientDB({
        ...data,
        items: data?.items || [],
        deletedItems: data?.deleted || [],
        dataStore: config!.dataStore,
        stateUpdateFunction: registry.updateState,
        stateUpdateFunctionDeleted: registry.clearDeleted,
        online: networkStatus.online,
        clientOnly,
        sameDate: true,
        db,
        // ... pass relevant store-specific update functions from a registry
      });
    }

    // 2. PHASE TWO: Batch Sync to Server
    if (networkStatus.online && session) {
      // Instead of multiple debounced calls, we pass the WHOLE payload
      // to one debounced function that hits a single /api/sync/batch endpoint
      debounceMergedSyncToServer({ ...payload, db, ...params });
    }
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
  }
};

export const syncToServerDBMerged = async (
  payload: MergedSyncPayload,
  options: { apiUrl: string },
) => {
  const now = new Date();
  const finalPayload: Record<string, any> = {};
  const activeStores: string[] = [];

  // Iterate through the keys (posts, categories, etc.)
  (Object.keys(payload) as SyncStoreKey[]).forEach((key) => {
    const data = (payload as any)[key];
    if (data && (data.items.length > 0 || data.deleted.length > 0)) {
      // This now contains { upserts: [...], deletedIds: [...] }
      finalPayload[key] = prepareStorePayload(key, data, now);
      activeStores.push(key);
    }
  });

  try {
    if (activeStores.length === 0) return;

    const response = await fetch(`${options.apiUrl}/app-data?stores=${activeStores.join(',')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();

    return { success: true, data: result };
  } catch (error) {
    // Handle mass error state
    console.error('Merged Server Sync Error:', error);
    return { success: false, error };
  }
};

const prepareStorePayload = (
  key: SyncStoreKey,
  data: { items: any[]; deleted: any[] } | undefined,
  now: Date,
) => {
  if (!data) return null;

  // 1. Get items that need saving/updating
  const upserts = data.items
    .filter((i) => i.syncStatus !== SyncStatus.SYNCED && i.syncStatus !== SyncStatus.DELETED)
    // ... rest of map
    .map((item) => ({
      ...item,
      updatedAt: now.toISOString(),
      syncStatus: SyncStatus.SYNCED,
    }));

  // 2. Get the IDs of items marked for deletion
  // This is where your cart items live after orderUpdate runs
  const deletedIds = data.deleted.map((i) => i.id);

  return {
    upserts, // Changed from [key] to a fixed key for easier API parsing
    deletedIds,
  };
};

export const handleServerResponse = async (
  responsePayload: Record<string, any>,
  networkStatus: UserNetworkReturnValue,
  db: Database,
) => {
  // 1. Iterate through the keys returned by the server
  for (const [key, items] of Object.entries(responsePayload)) {
    const config = SYNC_STORES[key as SyncStoreKey];
    const registry = SYNC_REGISTRY[key as SyncStoreKey];

    // Safety Check: skip if config doesn't exist for this key
    if (!config || !registry) {
      console.warn(`Sync config for hook key "${key}" is missing in SYNC_STORES.`);
      continue;
    }

    // 2. Update Client DB & Zustand to 'SYNCED'
    // We use your existing syncToClientDB but with 'fromServer' flag
    await syncToClientDB({
      items: items,
      deletedItems: [], // Server already handled deletions
      dataStore: config.dataStore,
      stateUpdateFunction: registry.updateState,
      stateUpdateFunctionDeleted: registry.clearDeleted,
      online: networkStatus.online,
      cleanup: true, // This removes DELETED items from IndexedDB
      options: { fromServer: true },
      db,
    });
  }
};

export const syncToServerAfterDelay = async (
  params: MergedSyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    db: Database;
  },
) => {
  const { setSyncStatus, networkStatus, payload } = params;

  try {
    setSyncStatus(SyncStatus.PENDING);

    // 1. Send the merged payload
    const result = await syncToServerDBMerged(payload, { apiUrl: params.apiUrl });

    if (result?.error) {
      // handle errors (marking items with SyncStatus.ERROR)
      setSyncStatus(SyncStatus.ERROR);
      return;
    }

    // 2. Process the successful return to update local state
    if (result?.data) {
      await handleServerResponse(result.data.items, networkStatus, params.db);
    }

    setSyncStatus(SyncStatus.SYNCED);
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
    console.error('Sync to Server Error:', error);
  }
};

export const syncToClientDB = async (
  params: SyncParams & {
    sameDate?: boolean;
    online?: boolean;
    clientOnly?: boolean;
    cleanup?: boolean;
    options?: { fromServer?: boolean };
    db: Database;
  },
) => {
  if (params.options?.fromServer) {
    params.items = dedupeBy(params.items, (i) => i.id);
    params.deletedItems = dedupeBy(params.deletedItems || [], (i) => i.id);
  }

  const syncedItems = params.items.filter((p) => p.syncStatus == SyncStatus.SYNCED);

  const unsyncedItems = [
    ...params.items,
    ...(params.options?.fromServer ? [] : params.deletedItems || []),
  ].filter((p) => p.syncStatus != SyncStatus.SYNCED);

  try {
    // Update IndexedDB with unsynced items items

    let savedItems: any[] = params.options?.fromServer ? params.items : [];

    if (unsyncedItems.length) {
      savedItems = unsyncedItems.map((item) => {
        return {
          ...item,
          updatedAt: params.sameDate ? item.updatedAt : new Date().toISOString(),
          syncStatus:
            item.syncStatus == SyncStatus.DELETED
              ? SyncStatus.DELETED
              : item.syncStatus == SyncStatus.ERROR
                ? SyncStatus.ERROR
                : params.online && !params.clientOnly
                  ? SyncStatus.SYNCED_CLIENT
                  : SyncStatus.SAVED,
        };
      });
    }

    if (!savedItems.length) return;

    if (params.cleanup) {
      const deletedItems = savedItems.filter((i) => i.syncStatus == SyncStatus.DELETED);

      if (deletedItems.length) {
        // remove items with sync status DELETE from client
        await params.db.delete(params.dataStore, deletedItems);
      }
    }

    const savedItemsNotDeleted: any[] = savedItems.filter(
      (i) => i.syncStatus != SyncStatus.DELETED,
    );

    const clientDbItems = params.cleanup ? savedItemsNotDeleted : savedItems;

    const finalClientDbItems = params.options?.fromServer
      ? clientDbItems
      : [...clientDbItems, ...syncedItems];

    await params.db.put(params.dataStore, finalClientDbItems);

    const stateItems = params.options?.fromServer
      ? syncedItems
      : finalClientDbItems.filter((i) => i.syncStatus != SyncStatus.DELETED);

    if (params.deletedItems?.length) {
      params.stateUpdateFunctionDeleted();
    }

    params.stateUpdateFunction(stateItems);
  } catch (error) {
    console.error('Client DB Sync Error:', (error as DatabaseError).message);
    throw error;
  }
};

function dedupeBy<T, K>(arr: T[], key: (item: T) => K): T[] {
  return Array.from(new Map(arr.map((i) => [key(i), i])).values());
}

const RECENT_THRESHOLD_MS = 10_000; // 10 seconds (tune this)

const isRecent = (date: string | Date) => {
  const t = new Date(date).getTime();
  return Date.now() - t < RECENT_THRESHOLD_MS;
};
