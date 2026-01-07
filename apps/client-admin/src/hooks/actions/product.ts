import { useStoreProduct } from '@/libraries/zustand/stores/product';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { ProductGet } from '@repo/types/models/product';
import {
  ProductDietaryType,
  ProductType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useProductActions = () => {
  const { session } = useStoreSession();
  const { addProduct, updateProduct, deleteProduct } = useStoreProduct();

  const productCreate = (params: Partial<ProductGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newProduct: ProductGet = {
      id: params.id || id,
      image: params.image || '',
      title: params.title || '',
      description: params.description || '',
      type: params.type || ProductType.PIZZA,
      dietary_class: params.dietary_class || ProductDietaryType.MEATY,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addProduct(newProduct);
  };

  const productUpdate = (params: ProductGet) => {
    if (!session) return;

    const now = new Date();

    const newProduct: ProductGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateProduct(newProduct);
  };

  const productDelete = (params: ProductGet) => {
    if (!session) return;

    const now = new Date();

    deleteProduct({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { productCreate, productUpdate, productDelete };
};
