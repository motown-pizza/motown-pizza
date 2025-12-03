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
import { useStoreProduct } from '@/libraries/zustand/stores/product';
import { useStoreCart } from '@/libraries/zustand/stores/cart';
import { useStoreVariant } from '@/libraries/zustand/stores/variant';
import { useStoreOrder } from '@/libraries/zustand/stores/order';

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
      serverUpdateFunction: async (i, di) => {
        // await productsUpdate(i, di);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, deletedProducts, setProducts, clearDeletedProducts]);

  useEffect(() => syncProducts(), [products, syncProducts, online]);

  return { syncProducts };
};

export const useSyncVariants = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    variants,
    deleted: deletedVariants,
    setVariants,
    clearDeletedVariants,
  } = useStoreVariant();

  const syncVariants = useCallback(() => {
    syncFunction({
      items: variants || [],
      deletedItems: deletedVariants,
      dataStore: STORE_NAME.VARIANTS,
      stateUpdateFunctionDeleted: () => clearDeletedVariants(),
      stateUpdateFunction: (i) => setVariants(i),
      serverUpdateFunction: async (i, di) => {
        // await variantsUpdate(i, di);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, deletedVariants, setVariants, clearDeletedVariants]);

  useEffect(() => syncVariants(), [variants, syncVariants, online]);

  return { syncVariants };
};

export const useSyncCart = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    cart,
    deleted: deletedCart,
    setCart,
    clearDeletedCart,
  } = useStoreCart();

  const syncCart = useCallback(() => {
    syncFunction({
      items: cart || [],
      deletedItems: deletedCart,
      dataStore: STORE_NAME.CART,
      stateUpdateFunctionDeleted: () => clearDeletedCart(),
      stateUpdateFunction: (i) => setCart(i),
      serverUpdateFunction: async (i, di) => {
        // await cartUpdate(i, di);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, deletedCart, setCart, clearDeletedCart]);

  useEffect(() => syncCart(), [cart, syncCart, online]);

  return { syncCart };
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
      serverUpdateFunction: async (i, di) => {
        // await ordersUpdate(i, di);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, deletedOrders, setOrders, clearDeletedOrders]);

  useEffect(() => syncOrders(), [orders, syncOrders, online]);

  return { syncOrders };
};
