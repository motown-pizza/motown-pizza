'use client';

import { hasLength } from '@mantine/form';
import { useProductVariantActions } from '@repo/store';
import { useFormBase } from '../form';
import { ProductVariantGet } from '@repo/types';
import { Size, Status } from '@repo/types';
import { useStoreProduct } from '@repo/store';

export const useFormProductVariant = (params?: { defaultValues?: Partial<ProductVariantGet> }) => {
  const { products } = useStoreProduct();
  const product = products?.find((pi) => pi.id == params?.defaultValues?.productId);

  const { productVariantCreate, productVariantUpdate } = useProductVariantActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ProductVariantGet>>(
    {
      measurement: params?.defaultValues?.measurement || '',
      price: params?.defaultValues?.price || 0,
      productId: params?.defaultValues?.productId || '',
      size: params?.defaultValues?.size || Size.MEDIUM,
      title: `${params?.defaultValues?.title || ''}${!product || params?.defaultValues?.title?.includes(product.title) ? '' : ` ${product.title}`}`,
      status: params?.defaultValues?.status || Status.ACTIVE,
    },
    {
      measurement: hasLength({ max: 48 }, 'Max 48 characters'),
      price: (value) => (!value || value < 1) && 'Price required',
      size: hasLength({ min: 1 }, 'Variant size required'),
      status: hasLength({ min: 1 }, 'Variant status required'),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: false,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<ProductVariantGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          productVariantCreate({
            ...submitObject,
          });
        } else {
          productVariantUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ProductVariantGet);
        }
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
