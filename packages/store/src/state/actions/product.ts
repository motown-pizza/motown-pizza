'use client';

import { useStoreProduct } from '../product';
import { useStoreSession } from '../session';
import { ProductGet } from '@repo/types';
import { ProductDietaryType, ProductType, Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

export const useProductActions = () => {
  const { session } = useStoreSession();
  const { addProduct, updateProduct, deleteProduct } = useStoreProduct();
  const { showNotification } = useNotification();

  const productCreate = (params: Partial<ProductGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newProduct: ProductGet = {
      id: params.id || id,
      image: params.image || '',
      imageId: params.imageId || '',
      title: params.title || '',
      description: params.description || '',
      type: params.type || ProductType.PIZZA,
      dietaryClass: params.dietaryClass || ProductDietaryType.MEATY,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addProduct(newProduct);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Product Added',
      desc: `'${newProduct.title}' has been added`,
    });
  };

  const productUpdate = (params: ProductGet) => {
    if (!session) return;

    const now = new Date();

    const newProduct: ProductGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateProduct(newProduct);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Product Updated',
      desc: `'${newProduct.title}' has been updated`,
    });
  };

  const productDelete = (params: ProductGet) => {
    if (!session) return;

    const now = new Date();

    deleteProduct({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { productCreate, productUpdate, productDelete };
};
