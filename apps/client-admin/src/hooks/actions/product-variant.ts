import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { Size, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useProductVariantActions = () => {
  const { session } = useStoreSession();
  const { addProductVariant, updateProductVariant, deleteProductVariant } =
    useStoreProductVariant();

  const productVariantCreate = (params: Partial<ProductVariantGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newProductVariant: ProductVariantGet = {
      id: params.id || id,
      measurement: params.measurement || '',
      price: params.price || 0,
      product_id: params.product_id || '',
      size: params.size || Size.MEDIUM,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addProductVariant(newProductVariant);
  };

  const productVariantUpdate = (params: ProductVariantGet) => {
    if (!session) return;

    const now = new Date();

    const newProductVariant: ProductVariantGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateProductVariant(newProductVariant);
  };

  const productVariantDelete = (params: ProductVariantGet) => {
    if (!session) return;

    const now = new Date();

    deleteProductVariant({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { productVariantCreate, productVariantUpdate, productVariantDelete };
};
