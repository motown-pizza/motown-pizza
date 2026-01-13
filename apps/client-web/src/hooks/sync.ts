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
import { productsUpdate } from '@repo/handlers/requests/database/products';
import { productVariantsUpdate } from '@repo/handlers/requests/database/product-variants';
import { cartItemsUpdate } from '@repo/handlers/requests/database/cart-items';
import { ordersUpdate } from '@repo/handlers/requests/database/orders';
import { useStorePost } from '@/libraries/zustand/stores/post';
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { SyncParams } from '@repo/types/sync';
import { useStoreProduct } from '@/libraries/zustand/stores/product';
import { useStoreOrder } from '@/libraries/zustand/stores/order';
import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import { useStoreCartItems } from '@/libraries/zustand/stores/cart';

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
        await productsUpdate(i, di);
      },
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
      serverUpdateFunction: async (i, di) => {
        await productVariantsUpdate(i, di);
      },
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
  } = useStoreCartItems();

  const syncCartItems = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, deletedCartItems, setCartItems, clearDeletedCartItems]);

  useEffect(() => syncCartItems(), [cartItems, syncCartItems, online]);

  return { syncCartItems };
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
        await ordersUpdate(i, di);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, deletedOrders, setOrders, clearDeletedOrders]);

  useEffect(() => syncOrders(), [orders, syncOrders, online]);

  return { syncOrders };
};
