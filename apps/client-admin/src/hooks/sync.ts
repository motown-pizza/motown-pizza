/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { postsUpdate } from '@repo/handlers/requests/database/posts';
import { categoriesUpdate } from '@repo/handlers/requests/database/category';
import { useStorePost } from '@/libraries/zustand/stores/post';
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { SyncParams } from '@repo/types/sync';
import { useStoreProfile } from '@/libraries/zustand/stores/profile';
import { profilesUpdate } from '@repo/handlers/requests/database/profiles';
import { useStoreProduct } from '@/libraries/zustand/stores/product';
import { productsUpdate } from '@repo/handlers/requests/database/products';
import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import { productVariantsUpdate } from '@repo/handlers/requests/database/product-variants';
import { useStoreIngredient } from '@/libraries/zustand/stores/ingredient';
import { ingredientsUpdate } from '@repo/handlers/requests/database/ingredients';
import { useStoreRecipieItem } from '@/libraries/zustand/stores/recipie-item';
import { recipieItemsUpdate } from '@repo/handlers/requests/database/recipie-items';
import { useStoreOrder } from '@/libraries/zustand/stores/order';
import { ordersUpdate } from '@repo/handlers/requests/database/orders';
import { useStoreOrderItem } from '@/libraries/zustand/stores/order-item';
import { orderItemsUpdate } from '@repo/handlers/requests/database/order-items';
import { useStoreStockMovement } from '@/libraries/zustand/stores/stock-movement';
import { stockMovementsUpdate } from '@repo/handlers/requests/database/stock-movements';
import { useStoreTransporter } from '@/libraries/zustand/stores/transporter';
import { transportersUpdate } from '@repo/handlers/requests/database/transporters';

export const useSyncProfiles = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    profiles,
    deleted: deletedProfiles,
    setProfiles,
    clearDeletedProfiles,
  } = useStoreProfile();

  const syncProfiles = useCallback(() => {
    syncFunction({
      items: profiles || [],
      deletedItems: deletedProfiles,
      dataStore: STORE_NAME.PROFILES,
      stateUpdateFunctionDeleted: () => clearDeletedProfiles(),
      stateUpdateFunction: (i) => setProfiles(i),
      serverUpdateFunction: async (i, di) => await profilesUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profiles, deletedProfiles, setProfiles, clearDeletedProfiles]);

  useEffect(() => syncProfiles(), [profiles, syncProfiles, online]);

  return { syncProfiles };
};

export const useSyncPosts = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    posts,
    deleted: deletedPosts,
    setPosts,
    clearDeletedPosts,
  } = useStorePost();

  const syncPosts = useCallback(() => {
    syncFunction({
      items: posts || [],
      deletedItems: deletedPosts,
      dataStore: STORE_NAME.POSTS,
      stateUpdateFunctionDeleted: () => clearDeletedPosts(),
      stateUpdateFunction: (i) => setPosts(i),
      serverUpdateFunction: async (i, di) => await postsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, deletedPosts, setPosts, clearDeletedPosts]);

  useEffect(() => syncPosts(), [posts, syncPosts, online]);

  return { syncPosts };
};

export const useSyncCategories = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    categories,
    deleted: deletedCategories,
    setCategories,
    clearDeletedCategories,
  } = useStoreCategory();

  const syncCategories = useCallback(() => {
    syncFunction({
      items: categories || [],
      deletedItems: deletedCategories,
      dataStore: STORE_NAME.CATEGORIES,
      stateUpdateFunctionDeleted: () => clearDeletedCategories(),
      stateUpdateFunction: (i) => setCategories(i),
      serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, deletedCategories, setCategories, clearDeletedCategories]);

  useEffect(() => syncCategories(), [categories, syncCategories, online]);

  return { syncCategories };
};

export const useSyncProducts = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    products,
    deleted: deletedProducts,
    setProducts,
    clearDeletedProducts,
  } = useStoreProduct();

  const syncProducts = useCallback(() => {
    syncFunction({
      items: products || [],
      deletedItems: deletedProducts,
      dataStore: STORE_NAME.PRODUCTS,
      stateUpdateFunctionDeleted: () => clearDeletedProducts(),
      stateUpdateFunction: (i) => setProducts(i),
      serverUpdateFunction: async (i, di) => await productsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, deletedProducts, setProducts, clearDeletedProducts]);

  useEffect(() => syncProducts(), [products, syncProducts, online]);

  return { syncProducts };
};

export const useSyncProductVariants = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    productVariants,
    deleted: deletedProductVariants,
    setProductVariants,
    clearDeletedProductVariants,
  } = useStoreProductVariant();

  const syncProductVariants = useCallback(() => {
    syncFunction({
      items: productVariants || [],
      deletedItems: deletedProductVariants,
      dataStore: STORE_NAME.PRODUCT_VARIANTS,
      stateUpdateFunctionDeleted: () => clearDeletedProductVariants(),
      stateUpdateFunction: (i) => setProductVariants(i),
      serverUpdateFunction: async (i, di) => await productVariantsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productVariants,
    deletedProductVariants,
    setProductVariants,
    clearDeletedProductVariants,
  ]);

  useEffect(
    () => syncProductVariants(),
    [productVariants, syncProductVariants, online]
  );

  return { syncProductVariants };
};

export const useSyncIngredients = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    ingredients,
    deleted: deletedIngredients,
    setIngredients,
    clearDeletedIngredients,
  } = useStoreIngredient();

  const syncIngredients = useCallback(() => {
    syncFunction({
      items: ingredients || [],
      deletedItems: deletedIngredients,
      dataStore: STORE_NAME.INGREDIENTS,
      stateUpdateFunctionDeleted: () => clearDeletedIngredients(),
      stateUpdateFunction: (i) => setIngredients(i),
      serverUpdateFunction: async (i, di) => await ingredientsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ingredients,
    deletedIngredients,
    setIngredients,
    clearDeletedIngredients,
  ]);

  useEffect(() => syncIngredients(), [ingredients, syncIngredients, online]);

  return { syncIngredients };
};

export const useSyncRecipieItems = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    recipieItems,
    deleted: deletedRecipieItems,
    setRecipieItems,
    clearDeletedRecipieItems,
  } = useStoreRecipieItem();

  const syncRecipieItems = useCallback(() => {
    syncFunction({
      items: recipieItems || [],
      deletedItems: deletedRecipieItems,
      dataStore: STORE_NAME.RECIPIE_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedRecipieItems(),
      stateUpdateFunction: (i) => setRecipieItems(i),
      serverUpdateFunction: async (i, di) => await recipieItemsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    recipieItems,
    deletedRecipieItems,
    setRecipieItems,
    clearDeletedRecipieItems,
  ]);

  useEffect(() => syncRecipieItems(), [recipieItems, syncRecipieItems, online]);

  return { syncRecipieItems };
};

export const useSyncOrders = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    orders,
    deleted: deletedOrders,
    setOrders,
    clearDeletedOrders,
  } = useStoreOrder();

  const syncOrders = useCallback(() => {
    syncFunction({
      items: orders || [],
      deletedItems: deletedOrders,
      dataStore: STORE_NAME.ORDERS,
      stateUpdateFunctionDeleted: () => clearDeletedOrders(),
      stateUpdateFunction: (i) => setOrders(i),
      serverUpdateFunction: async (i, di) => await ordersUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, deletedOrders, setOrders, clearDeletedOrders]);

  useEffect(() => syncOrders(), [orders, syncOrders, online]);

  return { syncOrders };
};

export const useSyncOrderItems = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    orderItems,
    deleted: deletedOrderItems,
    setOrderItems,
    clearDeletedOrderItems,
  } = useStoreOrderItem();

  const syncOrderItems = useCallback(() => {
    syncFunction({
      items: orderItems || [],
      deletedItems: deletedOrderItems,
      dataStore: STORE_NAME.ORDER_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedOrderItems(),
      stateUpdateFunction: (i) => setOrderItems(i),
      serverUpdateFunction: async (i, di) => await orderItemsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItems, deletedOrderItems, setOrderItems, clearDeletedOrderItems]);

  useEffect(() => syncOrderItems(), [orderItems, syncOrderItems, online]);

  return { syncOrderItems };
};

export const useSyncStockMovements = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    stockMovements,
    deleted: deletedStockMovements,
    setStockMovements,
    clearDeletedStockMovements,
  } = useStoreStockMovement();

  const syncStockMovements = useCallback(() => {
    syncFunction({
      items: stockMovements || [],
      deletedItems: deletedStockMovements,
      dataStore: STORE_NAME.STOCK_MOVEMENTS,
      stateUpdateFunctionDeleted: () => clearDeletedStockMovements(),
      stateUpdateFunction: (i) => setStockMovements(i),
      serverUpdateFunction: async (i, di) => await stockMovementsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stockMovements,
    deletedStockMovements,
    setStockMovements,
    clearDeletedStockMovements,
  ]);

  useEffect(
    () => syncStockMovements(),
    [stockMovements, syncStockMovements, online]
  );

  return { syncStockMovements };
};

export const useSyncTransporters = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    transporters,
    deleted: deletedTransporters,
    setTransporters,
    clearDeletedTransporters,
  } = useStoreTransporter();

  const syncTransporters = useCallback(() => {
    syncFunction({
      items: transporters || [],
      deletedItems: deletedTransporters,
      dataStore: STORE_NAME.TRANSPORTERS,
      stateUpdateFunctionDeleted: () => clearDeletedTransporters(),
      stateUpdateFunction: (i) => setTransporters(i),
      serverUpdateFunction: async (i, di) => await transportersUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    transporters,
    deletedTransporters,
    setTransporters,
    clearDeletedTransporters,
  ]);

  useEffect(() => syncTransporters(), [transporters, syncTransporters, online]);

  return { syncTransporters };
};
