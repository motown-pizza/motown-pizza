'use client';

import { useStoreProductVariant } from '../product-variant';
import { useStoreSession } from '../session';
import { ProductVariantGet } from '@repo/types';
import { Size, Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';
import { useStoreRecipieItem } from '../recipie-item';

export const useProductVariantActions = () => {
  const { session } = useStoreSession();
  const { recipieItems, setRecipieItems } = useStoreRecipieItem();
  const { addProductVariant, updateProductVariant, deleteProductVariant } =
    useStoreProductVariant();
  const { showNotification } = useNotification();

  const productVariantCreate = (params: Partial<ProductVariantGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newProductVariant: ProductVariantGet = {
      id: params.id || id,
      measurement: params.measurement || '',
      price: params.price || 0,
      productId: params.productId || '',
      size: params.size || Size.MEDIUM,
      status: params.status || Status.ACTIVE,
      title: params.title || '',
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addProductVariant(newProductVariant);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Product Variant Added',
      desc: `'${newProductVariant.title}' has been added`,
    });
  };

  const productVariantUpdate = (params: ProductVariantGet) => {
    if (!session) return;

    const now = new Date();

    const newProductVariant: ProductVariantGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateProductVariant(newProductVariant);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Product Variant Updated',
      desc: `'${newProductVariant.title}' has been updated`,
    });
  };

  const productVariantDelete = (params: ProductVariantGet) => {
    if (!session) return;

    const now = new Date();

    if (recipieItems?.length) {
      setRecipieItems(
        recipieItems.map((ri) => {
          if (ri.productVariantId != params.id) {
            return ri;
          } else {
            return {
              ...ri,
              syncStatus: SyncStatus.DELETED,
              updatedAt: now.toISOString() as any,
            };
          }
        }),
      );
    }

    deleteProductVariant({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { productVariantCreate, productVariantUpdate, productVariantDelete };
};
