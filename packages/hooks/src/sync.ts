/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { SyncParams } from '@repo/types/sync';
import {
  categoriesGet,
  categoriesUpdate,
} from '@repo/handlers/requests/database/category';
import {
  ingredientsGet,
  ingredientsUpdate,
} from '@repo/handlers/requests/database/ingredients';
import {
  ordersGet,
  ordersUpdate,
} from '@repo/handlers/requests/database/orders';
import {
  productsGet,
  productsUpdate,
} from '@repo/handlers/requests/database/products';
import {
  orderItemsGet,
  orderItemsUpdate,
} from '@repo/handlers/requests/database/order-items';
import {
  productVariantsGet,
  productVariantsUpdate,
} from '@repo/handlers/requests/database/product-variants';
import {
  profilesGet,
  profilesUpdate,
} from '@repo/handlers/requests/database/profiles';
import {
  recipieItemsGet,
  recipieItemsUpdate,
} from '@repo/handlers/requests/database/recipie-items';
import {
  stockMovementsGet,
  stockMovementsUpdate,
} from '@repo/handlers/requests/database/stock-movements';
import {
  wishlistItemsGet,
  wishlistItemsUpdate,
} from '@repo/handlers/requests/database/wishlist-items';
import { profileGet } from '@repo/handlers/requests/database/profiles';
import {
  tablesGet,
  tablesUpdate,
} from '@repo/handlers/requests/database/tables';
import {
  cartItemsGet,
  cartItemsUpdate,
} from '@repo/handlers/requests/database/cart-items';
import {
  deliveriesGet,
  deliveriesUpdate,
} from '@repo/handlers/requests/database/deliveries';
import {
  tableBookingsGet,
  tableBookingsUpdate,
} from '@repo/handlers/requests/database/table-bookings';
import {
  SessionValue,
  useStoreSession,
} from '@repo/libraries/zustand/stores/session';
import { RoleValue, useStoreRole } from '@repo/libraries/zustand/stores/role';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { useStoreStockMovement } from '@repo/libraries/zustand/stores/stock-movement';
import { useStoreTable } from '@repo/libraries/zustand/stores/table';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { useStoreTableBooking } from '@repo/libraries/zustand/stores/table-booking';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { useStoreWishlistItem } from '@repo/libraries/zustand/stores/wishlist-item';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useIdle, UserNetworkReturnValue } from '@mantine/hooks';
import { SyncStatus } from '@repo/types/models/enums';
import { SyncStatusValue } from '@repo/libraries/zustand/stores/sync-status';
import {
  Database,
  DatabaseError,
} from '@repo/libraries/indexed-db/transactions';
import { API_URL } from '@repo/constants/paths';
import { openDatabase } from '@repo/libraries/indexed-db/actions';
import { config } from '@repo/libraries/indexed-db/config';

const useSessionCheck = () => {
  const session = useStoreSession((s) => s.session);
  const noSession =
    session === undefined ||
    (!session && (!(session as SessionValue)?.email as any));

  return { noSession };
};

type SyncStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  serverUpdate: (items: TItems[], deleted: TItems[]) => Promise<any>;
  getItems: (store: THookReturn) => TItems[];
  getDeleted: (store: THookReturn) => TItems[];
  setItems: (store: THookReturn, items: TItems[]) => void;
  clearDeleted: (store: THookReturn) => void;
};

export const SYNC_STORES: Record<string, SyncStoreConfig> = {
  [STORE_NAME.CATEGORIES]: {
    dataStore: STORE_NAME.CATEGORIES,
    useStoreHook: useStoreCategory,
    serverUpdate: categoriesUpdate,
    getItems: (store) => store.categories,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCategories(items),
    clearDeleted: (store) => store.clearDeletedCategories(),
  },
  [STORE_NAME.CART_ITEMS]: {
    dataStore: STORE_NAME.CART_ITEMS,
    useStoreHook: useStoreCartItem,
    serverUpdate: cartItemsUpdate,
    getItems: (store) => store.cartItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCartItems(items),
    clearDeleted: (store) => store.clearDeletedCartItems(),
  },
  [STORE_NAME.DELIVERIES]: {
    dataStore: STORE_NAME.DELIVERIES,
    useStoreHook: useStoreDelivery,
    serverUpdate: deliveriesUpdate,
    getItems: (store) => store.deliveries,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setDeliverys(items),
    clearDeleted: (store) => store.clearDeletedDeliverys(),
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
  [STORE_NAME.ORDERS]: {
    dataStore: STORE_NAME.ORDERS,
    useStoreHook: useStoreOrder,
    serverUpdate: ordersUpdate,
    getItems: (store) => store.orders,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setOrders(items),
    clearDeleted: (store) => store.clearDeletedOrders(),
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
  [STORE_NAME.PRODUCTS]: {
    dataStore: STORE_NAME.PRODUCTS,
    useStoreHook: useStoreProduct,
    serverUpdate: productsUpdate,
    getItems: (store) => store.products,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProducts(items),
    clearDeleted: (store) => store.clearDeletedProducts(),
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
  [STORE_NAME.TABLES]: {
    dataStore: STORE_NAME.TABLES,
    useStoreHook: useStoreTable,
    serverUpdate: tablesUpdate,
    getItems: (store) => store.tables,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTables(items),
    clearDeleted: (store) => store.clearDeletedTables(),
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

const SYNC_REGISTRY: Record<SyncStoreKey, any> = {
  [STORE_NAME.CATEGORIES]: {
    store: useStoreCategory,
    updateState: (items: any) =>
      useStoreCategory.getState().setCategories(items),
    clearDeleted: () => useStoreCategory.getState().clearDeletedCategories(),
  },
  [STORE_NAME.CART_ITEMS]: {
    store: useStoreCartItem,
    updateState: (items: any) =>
      useStoreCartItem.getState().setCartItems(items),
    clearDeleted: () => useStoreCartItem.getState().clearDeletedCartItems(),
  },
  [STORE_NAME.DELIVERIES]: {
    store: useStoreDelivery,
    updateState: (items: any) =>
      useStoreDelivery.getState().setDeliveries(items),
    clearDeleted: () => useStoreDelivery.getState().clearDeletedDeliveries(),
  },
  [STORE_NAME.INGREDIENTS]: {
    store: useStoreIngredient,
    updateState: (items: any) =>
      useStoreIngredient.getState().setIngredients(items),
    clearDeleted: () => useStoreIngredient.getState().clearDeletedIngredients(),
  },
  [STORE_NAME.ORDERS]: {
    store: useStoreOrder,
    updateState: (items: any) => useStoreOrder.getState().setOrders(items),
    clearDeleted: () => useStoreOrder.getState().clearDeletedOrders(),
  },
  [STORE_NAME.ORDER_ITEMS]: {
    store: useStoreOrderItem,
    updateState: (items: any) =>
      useStoreOrderItem.getState().setOrderItems(items),
    clearDeleted: () => useStoreOrderItem.getState().clearDeletedOrderItems(),
  },
  [STORE_NAME.PRODUCTS]: {
    store: useStoreProduct,
    updateState: (items: any) => useStoreProduct.getState().setProducts(items),
    clearDeleted: () => useStoreProduct.getState().clearDeletedProducts(),
  },
  [STORE_NAME.PRODUCT_VARIANTS]: {
    store: useStoreProductVariant,
    updateState: (items: any) =>
      useStoreProductVariant.getState().setProductVariants(items),
    clearDeleted: () =>
      useStoreProductVariant.getState().clearDeletedProductVariants(),
  },
  [STORE_NAME.PROFILES]: {
    store: useStoreProfile,
    updateState: (items: any) => useStoreProfile.getState().setProfiles(items),
    clearDeleted: () => useStoreProfile.getState().clearDeletedProfiles(),
  },
  [STORE_NAME.RECIPIE_ITEMS]: {
    store: useStoreRecipieItem,
    updateState: (items: any) =>
      useStoreRecipieItem.getState().setRecipieItems(items),
    clearDeleted: () =>
      useStoreRecipieItem.getState().clearDeletedRecipieItems(),
  },
  [STORE_NAME.STOCK_MOVEMENTS]: {
    store: useStoreStockMovement,
    updateState: (items: any) =>
      useStoreStockMovement.getState().setStockMovements(items),
    clearDeleted: () =>
      useStoreStockMovement.getState().clearDeletedStockMovements(),
  },
  [STORE_NAME.TABLES]: {
    store: useStoreTable,
    updateState: (items: any) => useStoreTable.getState().setTables(items),
    clearDeleted: () => useStoreTable.getState().clearDeletedTables(),
  },
  [STORE_NAME.TABLE_BOOKINGS]: {
    store: useStoreTableBooking,
    updateState: (items: any) =>
      useStoreTableBooking.getState().setTableBookings(items),
    clearDeleted: () =>
      useStoreTableBooking.getState().clearDeletedTableBookings(),
  },
  [STORE_NAME.WISHLIST_ITEMS]: {
    store: useStoreWishlistItem,
    updateState: (items: any) =>
      useStoreWishlistItem.getState().setWishlistItems(items),
    clearDeleted: () =>
      useStoreWishlistItem.getState().clearDeletedWishlistItems(),
  },
};

// Define a shape for the payload
export interface MergedSyncPayload {
  [STORE_NAME.CATEGORIES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.CART_ITEMS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.DELIVERIES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.INGREDIENTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.ORDERS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.ORDER_ITEMS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.PRODUCTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.PRODUCT_VARIANTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.PROFILES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.RECIPIE_ITEMS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.STOCK_MOVEMENTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.TABLES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.TABLE_BOOKINGS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.WISHLIST_ITEMS]?: { items: any[]; deleted: any[] };
}

// Update the MergedSyncParams to handle multiple datasets
export type MergedSyncParams = {
  payload: MergedSyncPayload;
  onSuccess?: (key: keyof MergedSyncPayload, updatedItems: any[]) => void;
  onClearDeleted?: (key: keyof MergedSyncPayload) => void;
};

export const useMergedSync = (params: {
  online: boolean;
  storesToSync: SyncStoreKey[]; // Use an array for stability
  handleSync: (payload: MergedSyncPayload) => Promise<void>;
  syncStatus: SyncStatusValue;
}) => {
  const { online, storesToSync, handleSync } = params;
  const idle = useIdle(2000, { events: ['keypress', 'click'] });
  const { noSession } = useSessionCheck();

  // Call all hooks at the top level (Required by Hook Rules)
  const categoryStore = useStoreCategory();
  const cartItemStore = useStoreCartItem();
  const deliveryStore = useStoreDelivery();
  const ingredientStore = useStoreIngredient();
  const orderStore = useStoreOrder();
  const orderItemStore = useStoreOrderItem();
  const productStore = useStoreProduct();
  const productVariantStore = useStoreProductVariant();
  const profileStore = useStoreProfile();
  const recipieItemStore = useStoreRecipieItem();
  const stockMovementStore = useStoreStockMovement();
  const tableStore = useStoreTable();
  const tableBookingStore = useStoreTableBooking();
  const wishlistItemStore = useStoreWishlistItem();

  const stores = {
    [STORE_NAME.CATEGORIES]: categoryStore,
    [STORE_NAME.CART_ITEMS]: cartItemStore,
    [STORE_NAME.DELIVERIES]: deliveryStore,
    [STORE_NAME.INGREDIENTS]: ingredientStore,
    [STORE_NAME.ORDERS]: orderStore,
    [STORE_NAME.ORDER_ITEMS]: orderItemStore,
    [STORE_NAME.PRODUCTS]: productStore,
    [STORE_NAME.PRODUCT_VARIANTS]: productVariantStore,
    [STORE_NAME.PROFILES]: profileStore,
    [STORE_NAME.RECIPIE_ITEMS]: recipieItemStore,
    [STORE_NAME.STOCK_MOVEMENTS]: stockMovementStore,
    [STORE_NAME.TABLES]: tableStore,
    [STORE_NAME.TABLE_BOOKINGS]: tableBookingStore,
    [STORE_NAME.WISHLIST_ITEMS]: wishlistItemStore,
  };

  const sync = useCallback(async () => {
    const payload: MergedSyncPayload = {};
    let hasDirtyData = false;

    // Build the payload dynamically based on what's active
    storesToSync.forEach((key) => {
      const config = SYNC_STORES[key];

      // Safety Check: skip if config doesn't exist for this key
      if (!config) {
        console.warn(
          `Sync config for hook key "${key}" is missing in SYNC_STORES.`
        );
        return;
      }

      const store = (stores as any)[key];
      const items = config.getItems(store) ?? [];
      const deleted = config.getDeleted(store) ?? [];

      // ONLY add to payload if there is something that needs action
      const needsSync = items.some(
        (i) =>
          i.sync_status === SyncStatus.PENDING ||
          i.sync_status === SyncStatus.SAVED ||
          i.sync_status === SyncStatus.ERROR
      );

      if (needsSync || deleted.length > 0) {
        (payload as any)[key] = { items, deleted };
        hasDirtyData = true;
      }
    });

    // Only proceed if we actually have work to do
    if (hasDirtyData && params.syncStatus !== SyncStatus.PENDING) {
      await handleSync(payload);
    }
  }, [
    storesToSync,
    categoryStore,
    cartItemStore,
    deliveryStore,
    ingredientStore,
    orderStore,
    orderItemStore,
    productStore,
    productVariantStore,
    profileStore,
    recipieItemStore,
    stockMovementStore,
    tableStore,
    tableBookingStore,
    wishlistItemStore,
    handleSync,
    params.syncStatus,
  ]);

  useEffect(() => {
    if (!noSession && idle && online) {
      sync();
    }
  }, [online, noSession, idle, sync]);
};

export const handleMergedSync = async (
  params: MergedSyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    debounceMergedSyncToServer: (...args: any) => void;
    clientOnly?: boolean;
  }
) => {
  const {
    payload,
    networkStatus,
    session,
    setSyncStatus,
    debounceMergedSyncToServer,
    clientOnly,
  } = params;

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
        dataStore: config.dataStore,
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

export const syncToServerDBMerged = async (payload: MergedSyncPayload) => {
  const now = new Date();
  const finalPayload: Record<string, any> = {};
  const activeStores: string[] = [];

  // Iterate through the keys (posts, categories, etc.)
  (Object.keys(payload) as SyncStoreKey[]).forEach((key) => {
    const data = (payload as any)[key];
    if (data && (data.items.length > 0 || data.deleted.length > 0)) {
      finalPayload[key] = prepareStorePayload(key, data, now);
      activeStores.push(key);
    }
  });

  try {
    if (activeStores.length === 0) return;

    const response = await fetch(
      `${API_URL}/app-data?stores=${activeStores.join(',')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      }
    );

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
  now: Date
) => {
  if (!data) return null;

  // const { items, deleted } = data;

  // Filter for items that aren't already synced
  const unsyncedItems = data.items
    .filter((i) => i.sync_status !== SyncStatus.SYNCED)
    .map((item) => ({
      ...item,
      updated_at: now.toISOString(),
      sync_status: SyncStatus.SYNCED,
    }));

  // 2. Map pending/saved items to SYNCED status for the server
  const upserts = unsyncedItems.map((item) => ({
    ...item,
    updated_at: now.toISOString(),
    sync_status: SyncStatus.SYNCED,
  }));

  // Extract just the IDs for deletion
  const deletedIds = data.deleted.map((i) => i.id);

  return {
    [key]: upserts, // e.g., "posts": [...]
    deletedIds: deletedIds,
  };
};

export const handleServerResponse = async (
  responsePayload: Record<string, any>,
  networkStatus: UserNetworkReturnValue,
  db: Database
) => {
  // 1. Iterate through the keys returned by the server
  for (const [key, items] of Object.entries(responsePayload)) {
    const config = SYNC_STORES[key as SyncStoreKey];
    const registry = SYNC_REGISTRY[key as SyncStoreKey];

    if (!config || !registry) continue;

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
  }
) => {
  const { setSyncStatus, networkStatus, payload } = params;

  try {
    setSyncStatus(SyncStatus.PENDING);

    // 1. Send the merged payload
    const result = await syncToServerDBMerged(payload);

    if (result?.error) {
      // handle errors (marking items with SyncStatus.ERROR)
      setSyncStatus(SyncStatus.ERROR);
      return;
    }

    // 2. Process the successful return to update local state
    if (result?.data) {
      await handleServerResponse(result.data, networkStatus, params.db);
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
                : params.online && !params.clientOnly
                  ? SyncStatus.SYNCED_CLIENT
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
        await params.db.delete(params.dataStore, deletedItems);
      }
    }

    const savedItemsNotDeleted: any[] = savedItems.filter(
      (i) => i.sync_status != SyncStatus.DELETED
    );

    const clientDbItems = params.cleanup ? savedItemsNotDeleted : savedItems;

    const finalClientDbItems = params.options?.fromServer
      ? clientDbItems
      : [...clientDbItems, ...syncedItems];

    await params.db.put(params.dataStore, finalClientDbItems);

    const stateItems = params.options?.fromServer
      ? syncedItems
      : finalClientDbItems.filter((i) => i.sync_status != SyncStatus.DELETED);

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
