/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useEffect, useCallback } from 'react';
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
import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { deliveriesUpdate } from '@repo/handlers/requests/database/deliveries';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { cartItemsUpdate } from '@repo/handlers/requests/database/cart-items';

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

  const handleSyncPosts = useCallback(() => {
    syncFunction({
      items: posts || [],
      deletedItems: deletedPosts,
      dataStore: STORE_NAME.POSTS,
      stateUpdateFunctionDeleted: () => clearDeletedPosts(),
      stateUpdateFunction: (i) => setPosts(i),
      serverUpdateFunction: async (i, di) => await postsUpdate(i, di),
    });
  }, [posts, deletedPosts, syncFunction, online]);

  useEffect(() => {
    if (posts === undefined && deletedPosts === undefined) return;
    if (!posts?.length && !deletedPosts?.length) return;

    handleSyncPosts();
  }, [posts, deletedPosts, handleSyncPosts, online]);

  return { syncPosts: handleSyncPosts };
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

  const handleSyncCategories = useCallback(() => {
    syncFunction({
      items: categories || [],
      deletedItems: deletedCategories,
      dataStore: STORE_NAME.CATEGORIES,
      stateUpdateFunctionDeleted: () => clearDeletedCategories(),
      stateUpdateFunction: (i) => setCategories(i),
      serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
    });
  }, [categories, deletedCategories, syncFunction, online]);

  useEffect(() => {
    if (categories === undefined && deletedCategories === undefined) return;
    if (!categories?.length && !deletedCategories?.length) return;

    handleSyncCategories();
  }, [categories, deletedCategories, handleSyncCategories, online]);

  return { syncCategories: handleSyncCategories };
};

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

  const handleSyncProfiles = useCallback(() => {
    syncFunction({
      items: profiles || [],
      deletedItems: deletedProfiles,
      dataStore: STORE_NAME.PROFILES,
      stateUpdateFunctionDeleted: () => clearDeletedProfiles(),
      stateUpdateFunction: (i) => setProfiles(i),
      serverUpdateFunction: async (i, di) => await profilesUpdate(i, di),
    });
  }, [profiles, deletedProfiles, syncFunction, online]);

  useEffect(() => {
    if (profiles === undefined && deletedProfiles === undefined) return;
    if (!profiles?.length && !deletedProfiles?.length) return;

    handleSyncProfiles();
  }, [profiles, deletedProfiles, handleSyncProfiles, online]);

  return { syncProfiles: handleSyncProfiles };
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

  const handleSyncProducts = useCallback(() => {
    syncFunction({
      items: products || [],
      deletedItems: deletedProducts,
      dataStore: STORE_NAME.PRODUCTS,
      stateUpdateFunctionDeleted: () => clearDeletedProducts(),
      stateUpdateFunction: (i) => setProducts(i),
      serverUpdateFunction: async (i, di) => {
        await productsUpdate(i, di);
      },
    });
  }, [products, deletedProducts, syncFunction, online]);

  useEffect(() => {
    if (products === undefined && deletedProducts === undefined) return;
    if (!products?.length && !deletedProducts?.length) return;

    handleSyncProducts();
  }, [products, deletedProducts, handleSyncProducts, online]);

  return { syncProducts: handleSyncProducts };
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

  const handleSyncProductVariants = useCallback(() => {
    syncFunction({
      items: productVariants || [],
      deletedItems: deletedProductVariants,
      dataStore: STORE_NAME.PRODUCT_VARIANTS,
      stateUpdateFunctionDeleted: () => clearDeletedProductVariants(),
      stateUpdateFunction: (i) => setProductVariants(i),
      serverUpdateFunction: async (i, di) => {
        await productVariantsUpdate(i, di);
      },
    });
  }, [productVariants, deletedProductVariants, syncFunction, online]);

  useEffect(() => {
    if (productVariants === undefined && deletedProductVariants === undefined)
      return;
    if (!productVariants?.length && !deletedProductVariants?.length) return;

    handleSyncProductVariants();
  }, [
    productVariants,
    deletedProductVariants,
    handleSyncProductVariants,
    online,
  ]);

  return { syncProductVariants: handleSyncProductVariants };
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

  const handleSyncIngredients = useCallback(() => {
    syncFunction({
      items: ingredients || [],
      deletedItems: deletedIngredients,
      dataStore: STORE_NAME.INGREDIENTS,
      stateUpdateFunctionDeleted: () => clearDeletedIngredients(),
      stateUpdateFunction: (i) => setIngredients(i),
      serverUpdateFunction: async (i, di) => await ingredientsUpdate(i, di),
    });
  }, [ingredients, deletedIngredients, syncFunction, online]);

  useEffect(() => {
    if (ingredients === undefined && deletedIngredients === undefined) return;
    if (!ingredients?.length && !deletedIngredients?.length) return;

    handleSyncIngredients();
  }, [ingredients, deletedIngredients, handleSyncIngredients, online]);

  return { syncIngredients: handleSyncIngredients };
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

  const handleSyncRecipieItems = useCallback(() => {
    syncFunction({
      items: recipieItems || [],
      deletedItems: deletedRecipieItems,
      dataStore: STORE_NAME.RECIPIE_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedRecipieItems(),
      stateUpdateFunction: (i) => setRecipieItems(i),
      serverUpdateFunction: async (i, di) => await recipieItemsUpdate(i, di),
    });
  }, [recipieItems, deletedRecipieItems, syncFunction, online]);

  useEffect(() => {
    if (recipieItems === undefined && deletedRecipieItems === undefined) return;
    if (!recipieItems?.length && !deletedRecipieItems?.length) return;

    handleSyncRecipieItems();
  }, [recipieItems, deletedRecipieItems, handleSyncRecipieItems, online]);

  return { syncRecipieItems: handleSyncRecipieItems };
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

  const handleSyncOrders = useCallback(() => {
    syncFunction({
      items: orders || [],
      deletedItems: deletedOrders,
      dataStore: STORE_NAME.ORDERS,
      stateUpdateFunctionDeleted: () => clearDeletedOrders(),
      stateUpdateFunction: (i) => setOrders(i),
      serverUpdateFunction: async (i, di) => {
        await ordersUpdate(i, di);
      },
    });
  }, [orders, deletedOrders, syncFunction, online]);

  useEffect(() => {
    if (orders === undefined && deletedOrders === undefined) return;
    if (!orders?.length && !deletedOrders?.length) return;

    handleSyncOrders();
  }, [orders, deletedOrders, handleSyncOrders, online]);

  return { syncOrders: handleSyncOrders };
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

  const handleSyncOrderItems = useCallback(() => {
    syncFunction({
      items: orderItems || [],
      deletedItems: deletedOrderItems,
      dataStore: STORE_NAME.ORDER_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedOrderItems(),
      stateUpdateFunction: (i) => setOrderItems(i),
      serverUpdateFunction: async (i, di) => await orderItemsUpdate(i, di),
    });
  }, [orderItems, deletedOrderItems, syncFunction, online]);

  useEffect(() => {
    if (orderItems === undefined && deletedOrderItems === undefined) return;
    if (!orderItems?.length && !deletedOrderItems?.length) return;

    handleSyncOrderItems();
  }, [orderItems, deletedOrderItems, handleSyncOrderItems, online]);

  return { syncOrderItems: handleSyncOrderItems };
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

  const handleSyncStockMovements = useCallback(() => {
    syncFunction({
      items: stockMovements || [],
      deletedItems: deletedStockMovements,
      dataStore: STORE_NAME.STOCK_MOVEMENTS,
      stateUpdateFunctionDeleted: () => clearDeletedStockMovements(),
      stateUpdateFunction: (i) => setStockMovements(i),
      serverUpdateFunction: async (i, di) => await stockMovementsUpdate(i, di),
    });
  }, [stockMovements, deletedStockMovements, syncFunction, online]);

  useEffect(() => {
    if (stockMovements === undefined && deletedStockMovements === undefined)
      return;
    if (!stockMovements?.length && !deletedStockMovements?.length) return;

    handleSyncStockMovements();
  }, [stockMovements, deletedStockMovements, handleSyncStockMovements, online]);

  return { syncStockMovements: handleSyncStockMovements };
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

  const handleSyncDeliveries = useCallback(() => {
    syncFunction({
      items: deliveries || [],
      deletedItems: deletedDeliveries,
      dataStore: STORE_NAME.DELIVERIES,
      stateUpdateFunctionDeleted: () => clearDeletedDeliveries(),
      stateUpdateFunction: (i) => setDeliveries(i),
      serverUpdateFunction: async (i, di) => await deliveriesUpdate(i, di),
    });
  }, [deliveries, deletedDeliveries, syncFunction, online]);

  useEffect(() => {
    if (deliveries === undefined && deletedDeliveries === undefined) return;
    if (!deliveries?.length && !deletedDeliveries?.length) return;

    handleSyncDeliveries();
  }, [deliveries, deletedDeliveries, handleSyncDeliveries, online]);

  return { syncDeliveries: handleSyncDeliveries };
};

export const useSyncCartItems = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    cartItems,
    deleted: deletedCartItems,
    setCartItems,
    clearDeletedCartItems,
  } = useStoreCartItem();

  const handleSyncCartItems = useCallback(() => {
    syncFunction({
      items: cartItems || [],
      deletedItems: deletedCartItems,
      dataStore: STORE_NAME.CART_ITEMS,
      stateUpdateFunctionDeleted: () => clearDeletedCartItems(),
      stateUpdateFunction: (i) => setCartItems(i),
      serverUpdateFunction: async (i, di) => {
        await cartItemsUpdate(i, di);
      },
    });
  }, [cartItems, deletedCartItems, syncFunction, online]);

  useEffect(() => {
    if (cartItems === undefined && deletedCartItems === undefined) return;
    if (!cartItems?.length && !deletedCartItems?.length) return;

    handleSyncCartItems();
  }, [cartItems, deletedCartItems, handleSyncCartItems, online]);

  return { syncCartItems: handleSyncCartItems };
};
