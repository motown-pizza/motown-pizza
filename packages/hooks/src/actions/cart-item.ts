import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';
import { CartItemGet } from '@repo/types/models/cart-item';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';

export const useCartItemActions = () => {
  const { session } = useStoreSession();
  const { productVariants } = useStoreProductVariant();
  const { products } = useStoreProduct();
  const { addCartItem, updateCartItem, deleteCartItem } = useStoreCartItem();
  const { showNotification } = useNotification();

  const cartItemCreate = (params: Partial<CartItemGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newCartItem: CartItemGet = {
      id: params.id || id,
      product_variant_id: params.product_variant_id || '',
      profile_id: session.id || null,
      quantity: params.quantity || 1,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addCartItem(newCartItem);

    const productVariant = productVariants?.find(
      (pv) => pv.id == newCartItem.product_variant_id
    );

    const product = products?.find((p) => p.id == productVariant?.product_id);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Item Added',
      desc: `${!product ? 'Item' : `${product.title} (${productVariant?.title || productVariant?.size || ''})`} has been added to cart`,
    });
  };

  const cartItemUpdate = (params: CartItemGet) => {
    if (!session) return;

    const now = new Date();

    const newCartItem: CartItemGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateCartItem(newCartItem);
  };

  const cartItemDelete = (params: CartItemGet) => {
    if (!session) return;

    const now = new Date();

    deleteCartItem({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { cartItemCreate, cartItemUpdate, cartItemDelete };
};
