/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { postsUpdate } from '@repo/handlers/requests/database/posts';
import { categoriesUpdate } from '@repo/handlers/requests/database/category';
import { useStorePost } from '@repo/libraries/zustand/stores/post';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { SyncParams } from '@repo/types/sync';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { profilesUpdate } from '@repo/handlers/requests/database/profiles';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { productsUpdate } from '@repo/handlers/requests/database/products';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { productVariantsUpdate } from '@repo/handlers/requests/database/product-variants';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { ingredientsUpdate } from '@repo/handlers/requests/database/ingredients';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { recipieItemsUpdate } from '@repo/handlers/requests/database/recipie-items';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { ordersUpdate } from '@repo/handlers/requests/database/orders';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { orderItemsUpdate } from '@repo/handlers/requests/database/order-items';
import { useStoreStockMovement } from '@repo/libraries/zustand/stores/stock-movement';
import { stockMovementsUpdate } from '@repo/handlers/requests/database/stock-movements';
import { useDebouncedCallback } from '@mantine/hooks';
import { DEBOUNCE_VALUE } from '@repo/constants/sizes';
import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { deliveriesUpdate } from '@repo/handlers/requests/database/deliveries';

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

  const handleSyncProfiles = useDebouncedCallback(() => {
    syncFunction({
      items: profiles || [],
      deletedItems: deletedProfiles,
      dataStore: STORE_NAME.PROFILES,
      stateUpdateFunctionDeleted: () => clearDeletedProfiles(),
      stateUpdateFunction: (i) => setProfiles(i),
      serverUpdateFunction: async (i, di) => await profilesUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncProfiles = useDebouncedCallback(
    handleSyncProfiles,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (profiles === undefined && deletedProfiles === undefined) return;
    if (!profiles?.length && !deletedProfiles?.length) return;

    debounceSyncProfiles();
  }, [profiles, deletedProfiles, debounceSyncProfiles, online]);

  return { syncProfiles: debounceSyncProfiles };
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

  const handleSyncPosts = useDebouncedCallback(() => {
    syncFunction({
      items: posts || [],
      deletedItems: deletedPosts,
      dataStore: STORE_NAME.POSTS,
      stateUpdateFunctionDeleted: () => clearDeletedPosts(),
      stateUpdateFunction: (i) => setPosts(i),
      serverUpdateFunction: async (i, di) => await postsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncPosts = useDebouncedCallback(
    handleSyncPosts,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (posts === undefined && deletedPosts === undefined) return;
    if (!posts?.length && !deletedPosts?.length) return;

    debounceSyncPosts();
  }, [posts, deletedPosts, debounceSyncPosts, online]);

  return { syncPosts: debounceSyncPosts };
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

  const handleSyncCategories = useDebouncedCallback(() => {
    syncFunction({
      items: categories || [],
      deletedItems: deletedCategories,
      dataStore: STORE_NAME.CATEGORIES,
      stateUpdateFunctionDeleted: () => clearDeletedCategories(),
      stateUpdateFunction: (i) => setCategories(i),
      serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncCategories = useDebouncedCallback(
    handleSyncCategories,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (categories === undefined && deletedCategories === undefined) return;
    if (!categories?.length && !deletedCategories?.length) return;

    debounceSyncCategories();
  }, [categories, deletedCategories, debounceSyncCategories, online]);

  return { syncCategories: debounceSyncCategories };
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

  const handleSyncProducts = useDebouncedCallback(() => {
    syncFunction({
      items: products || [],
      deletedItems: deletedProducts,
      dataStore: STORE_NAME.PRODUCTS,
      stateUpdateFunctionDeleted: () => clearDeletedProducts(),
      stateUpdateFunction: (i) => setProducts(i),
      serverUpdateFunction: async (i, di) => await productsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncProducts = useDebouncedCallback(
    handleSyncProducts,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (products === undefined && deletedProducts === undefined) return;
    if (!products?.length && !deletedProducts?.length) return;

    debounceSyncProducts();
  }, [products, deletedProducts, debounceSyncProducts, online]);

  return { syncProducts: debounceSyncProducts };
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

  const handleSyncProductVariants = useDebouncedCallback(() => {
    syncFunction({
      items: productVariants || [],
      deletedItems: deletedProductVariants,
      dataStore: STORE_NAME.PRODUCT_VARIANTS,
      stateUpdateFunctionDeleted: () => clearDeletedProductVariants(),
      stateUpdateFunction: (i) => setProductVariants(i),
      serverUpdateFunction: async (i, di) => await productVariantsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncProductVariants = useDebouncedCallback(
    handleSyncProductVariants,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (productVariants === undefined && deletedProductVariants === undefined)
      return;
    if (!productVariants?.length && !deletedProductVariants?.length) return;

    debounceSyncProductVariants();
  }, [
    productVariants,
    deletedProductVariants,
    debounceSyncProductVariants,
    online,
  ]);

  return { syncProductVariants: debounceSyncProductVariants };
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

  const handleSyncIngredients = useDebouncedCallback(() => {
    syncFunction({
      items: ingredients || [],
      deletedItems: deletedIngredients,
      dataStore: STORE_NAME.INGREDIENTS,
      stateUpdateFunctionDeleted: () => clearDeletedIngredients(),
      stateUpdateFunction: (i) => setIngredients(i),
      serverUpdateFunction: async (i, di) => await ingredientsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncIngredients = useDebouncedCallback(
    handleSyncIngredients,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (ingredients === undefined && deletedIngredients === undefined) return;
    if (!ingredients?.length && !deletedIngredients?.length) return;

    debounceSyncIngredients();
  }, [ingredients, deletedIngredients, debounceSyncIngredients, online]);

  return { syncIngredients: debounceSyncIngredients };
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

  const handleSyncRecipieItems = useDebouncedCallback(() => {
    syncFunction({
      items: recipieItems || [],
      deletedItems: deletedRecipieItems,
      dataStore: STORE_NAME.RECIPIE_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedRecipieItems(),
      stateUpdateFunction: (i) => setRecipieItems(i),
      serverUpdateFunction: async (i, di) => await recipieItemsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncRecipieItems = useDebouncedCallback(
    handleSyncRecipieItems,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (recipieItems === undefined && deletedRecipieItems === undefined) return;
    if (!recipieItems?.length && !deletedRecipieItems?.length) return;

    debounceSyncRecipieItems();
  }, [recipieItems, deletedRecipieItems, debounceSyncRecipieItems, online]);

  return { syncRecipieItems: debounceSyncRecipieItems };
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

  const handleSyncOrders = useDebouncedCallback(() => {
    syncFunction({
      items: orders || [],
      deletedItems: deletedOrders,
      dataStore: STORE_NAME.ORDERS,
      stateUpdateFunctionDeleted: () => clearDeletedOrders(),
      stateUpdateFunction: (i) => setOrders(i),
      serverUpdateFunction: async (i, di) => await ordersUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncOrders = useDebouncedCallback(
    handleSyncOrders,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (orders === undefined && deletedOrders === undefined) return;
    if (!orders?.length && !deletedOrders?.length) return;

    debounceSyncOrders();
  }, [orders, deletedOrders, debounceSyncOrders, online]);

  return { syncOrders: debounceSyncOrders };
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

  const handleSyncOrderItems = useDebouncedCallback(() => {
    syncFunction({
      items: orderItems || [],
      deletedItems: deletedOrderItems,
      dataStore: STORE_NAME.ORDER_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedOrderItems(),
      stateUpdateFunction: (i) => setOrderItems(i),
      serverUpdateFunction: async (i, di) => await orderItemsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncOrderItems = useDebouncedCallback(
    handleSyncOrderItems,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (orderItems === undefined && deletedOrderItems === undefined) return;
    if (!orderItems?.length && !deletedOrderItems?.length) return;

    debounceSyncOrderItems();
  }, [orderItems, deletedOrderItems, debounceSyncOrderItems, online]);

  return { syncOrderItems: debounceSyncOrderItems };
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

  const handleSyncStockMovements = useDebouncedCallback(() => {
    syncFunction({
      items: stockMovements || [],
      deletedItems: deletedStockMovements,
      dataStore: STORE_NAME.STOCK_MOVEMENTS,
      stateUpdateFunctionDeleted: () => clearDeletedStockMovements(),
      stateUpdateFunction: (i) => setStockMovements(i),
      serverUpdateFunction: async (i, di) => await stockMovementsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncStockMovements = useDebouncedCallback(
    handleSyncStockMovements,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (stockMovements === undefined && deletedStockMovements === undefined)
      return;
    if (!stockMovements?.length && !deletedStockMovements?.length) return;

    debounceSyncStockMovements();
  }, [
    stockMovements,
    deletedStockMovements,
    debounceSyncStockMovements,
    online,
  ]);

  return { syncStockMovements: debounceSyncStockMovements };
};

export const useSyncDeliveries = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    deliveries,
    deleted: deletedDeliveries,
    setDeliveries,
    clearDeletedDeliveries,
  } = useStoreDelivery();

  const handleSyncDeliveries = useDebouncedCallback(() => {
    syncFunction({
      items: deliveries || [],
      deletedItems: deletedDeliveries,
      dataStore: STORE_NAME.DELIVERIES,
      stateUpdateFunctionDeleted: () => clearDeletedDeliveries(),
      stateUpdateFunction: (i) => setDeliveries(i),
      serverUpdateFunction: async (i, di) => await deliveriesUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncDeliveries = useDebouncedCallback(
    handleSyncDeliveries,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (deliveries === undefined && deletedDeliveries === undefined) return;
    if (!deliveries?.length && !deletedDeliveries?.length) return;

    debounceSyncDeliveries();
  }, [deliveries, deletedDeliveries, debounceSyncDeliveries, online]);

  return { syncDeliveries: debounceSyncDeliveries };
};
