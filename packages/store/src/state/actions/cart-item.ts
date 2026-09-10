'use client';

import { useStoreCartItem } from '../cart-item';
import { useStoreSession } from '../session';
import { useStoreProductVariant } from '../product-variant';
import { useStoreProduct } from '../product';
// import { useNotification } from '@repo/notifications';
import { CartItemGet } from '@repo/types';
import { Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';

export const useCartItemActions = () => {
  const { session } = useStoreSession();
  const { productVariants } = useStoreProductVariant();
  const { products } = useStoreProduct();
  const { addCartItem, updateCartItem, deleteCartItem } = useStoreCartItem();
  // const { showNotification } = useNotification();

  const cartItemCreate = (params: Partial<CartItemGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newCartItem: CartItemGet = {
      id: params.id || id,
      productVariantId: params.productVariantId || '',
      profileId: session.email ? session.id : null,
      quantity: params.quantity || 1,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addCartItem(newCartItem);

    const productVariant = productVariants?.find((pv) => pv.id == newCartItem.productVariantId);

    const product = products?.find((p) => p.id == productVariant?.productId);

    // showNotification({
    //   variant: Variant.SUCCESS,
    //   title: 'Item Added',
    //   desc: `${!product ? 'Item' : `${product.title} (${productVariant?.title || productVariant?.size || ''})`} has been added to cart`,
    // });
  };

  const cartItemUpdate = (params: CartItemGet) => {
    if (!session) return;

    const now = new Date();

    const newCartItem: CartItemGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateCartItem(newCartItem);
  };

  const cartItemDelete = (params: CartItemGet) => {
    if (!session) return;

    const now = new Date();

    deleteCartItem({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { cartItemCreate, cartItemUpdate, cartItemDelete };
};
