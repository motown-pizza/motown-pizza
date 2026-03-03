/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { SyncParams } from '@repo/types/sync';
import { categoriesGet } from '@repo/handlers/requests/database/category';
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
  cartItems: {
    dataStore: STORE_NAME.CART_ITEMS,
    useStoreHook: useStoreCartItem,
    serverUpdate: cartItemsUpdate,
    getItems: (store) => store.cartItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCartItems(items),
    clearDeleted: (store) => store.clearDeletedCartItems(),
  },
  deliveries: {
    dataStore: STORE_NAME.DELIVERIES,
    useStoreHook: useStoreDelivery,
    serverUpdate: deliveriesUpdate,
    getItems: (store) => store.deliveries,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setDeliverys(items),
    clearDeleted: (store) => store.clearDeletedDeliverys(),
  },
  ingredients: {
    dataStore: STORE_NAME.INGREDIENTS,
    useStoreHook: useStoreIngredient,
    serverUpdate: ingredientsUpdate,
    getItems: (store) => store.ingredients,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setIngredients(items),
    clearDeleted: (store) => store.clearDeletedIngredients(),
  },
  orders: {
    dataStore: STORE_NAME.ORDERS,
    useStoreHook: useStoreOrder,
    serverUpdate: ordersUpdate,
    getItems: (store) => store.orders,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setOrders(items),
    clearDeleted: (store) => store.clearDeletedOrders(),
  },
  orderItems: {
    dataStore: STORE_NAME.ORDER_ITEMS,
    useStoreHook: useStoreOrderItem,
    serverUpdate: orderItemsUpdate,
    getItems: (store) => store.orderItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setOrderItems(items),
    clearDeleted: (store) => store.clearDeletedOrderItems(),
  },
  products: {
    dataStore: STORE_NAME.PRODUCTS,
    useStoreHook: useStoreProduct,
    serverUpdate: productsUpdate,
    getItems: (store) => store.products,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProducts(items),
    clearDeleted: (store) => store.clearDeletedProducts(),
  },
  productVariants: {
    dataStore: STORE_NAME.PRODUCT_VARIANTS,
    useStoreHook: useStoreProductVariant,
    serverUpdate: productVariantsUpdate,
    getItems: (store) => store.productVariants,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProductVariants(items),
    clearDeleted: (store) => store.clearDeletedProductVariants(),
  },
  profiles: {
    dataStore: STORE_NAME.PROFILES,
    useStoreHook: useStoreProfile,
    serverUpdate: profilesUpdate,
    getItems: (store) => store.profiles,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setProfiles(items),
    clearDeleted: (store) => store.clearDeletedProfiles(),
  },
  recipieItems: {
    dataStore: STORE_NAME.RECIPIE_ITEMS,
    useStoreHook: useStoreRecipieItem,
    serverUpdate: recipieItemsUpdate,
    getItems: (store) => store.recipieItems,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setRecipieItems(items),
    clearDeleted: (store) => store.clearDeletedRecipieItems(),
  },
  stockMovements: {
    dataStore: STORE_NAME.STOCK_MOVEMENTS,
    useStoreHook: useStoreStockMovement,
    serverUpdate: stockMovementsUpdate,
    getItems: (store) => store.stockMovements,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setStockMovements(items),
    clearDeleted: (store) => store.clearDeletedStockMovements(),
  },
  tables: {
    dataStore: STORE_NAME.TABLES,
    useStoreHook: useStoreTable,
    serverUpdate: tablesUpdate,
    getItems: (store) => store.tables,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTablees(items),
    clearDeleted: (store) => store.clearDeletedTablees(),
  },
  tableBookings: {
    dataStore: STORE_NAME.TABLE_BOOKINGS,
    useStoreHook: useStoreTableBooking,
    serverUpdate: tableBookingsUpdate,
    getItems: (store) => store.tableBookings,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTableBookings(items),
    clearDeleted: (store) => store.clearDeletedTableBookings(),
  },
  wishlistItems: {
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

const useGenericSync = <K extends keyof typeof SYNC_STORES>(params: {
  storeKey: K;
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { storeKey, syncFunction, online } = params;
  const { noSession } = useSessionCheck();

  const config = SYNC_STORES[storeKey] as SyncStoreConfig;
  const store = config.useStoreHook();

  const sync = useCallback(() => {
    syncFunction({
      items: config.getItems(store) ?? [], // ← fallback to []
      deletedItems: config.getDeleted(store) ?? [], // ← fallback to []
      dataStore: config.dataStore,
      stateUpdateFunctionDeleted: () => config.clearDeleted(store),
      stateUpdateFunction: (i) => config.setItems(store, i),
      serverUpdateFunction: async (i, di) =>
        await config.serverUpdate(i ?? [], di ?? []), // ← fallback here too
    });
  }, [store, syncFunction, config]);

  useEffect(() => {
    if (noSession) return;
    sync();
  }, [store, online, noSession, sync]);
};

export const useSyncStores = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
  storesToSync: Partial<Record<SyncStoreKey, boolean>>;
}) => {
  const { syncFunction, online, storesToSync } = params;

  const results = {} as Record<string, any>;

  (Object.keys(storesToSync) as SyncStoreKey[]).forEach((key) => {
    if (!storesToSync[key]) return;

    results[key] = useGenericSync({
      storeKey: key,
      syncFunction,
      online,
    });
  });

  return results;
};
