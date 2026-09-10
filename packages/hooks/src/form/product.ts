'use client';

import { hasLength, UseFormReturnType } from '@mantine/form';
import { useProductActions } from '@repo/store';
import { useFormBase } from '../form';
import { ProductDietarySubType, ProductGet } from '@repo/types';
import { ProductDietaryType, ProductType, Status } from '@repo/types';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';
import { useRouter } from 'next/navigation';

export type FormProduct = ReturnType<typeof useFormProduct>['form'];

export const useFormProduct = (params?: { defaultValues?: Partial<ProductGet> }) => {
  const { productCreate, productUpdate } = useProductActions();
  const { showNotification } = useNotification();
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ProductGet>>(
    {
      id: params?.defaultValues?.id || '',
      description: params?.defaultValues?.description || '',
      dietaryClass: params?.defaultValues?.dietaryClass || ProductDietaryType.NEUTRAL,
      dietarySubClass: (params?.defaultValues?.dietarySubClass || '') as any,
      image: params?.defaultValues?.image || '',
      imageId: params?.defaultValues?.imageId || '',
      type: params?.defaultValues?.type || ProductType.PIZZA,
      title: params?.defaultValues?.title || '',
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      title: hasLength({ min: 2, max: 96 }, 'Between 2 and 96 characters'),
      description: hasLength({ max: 255 }, 'Max 255 characters'),
      dietaryClass: hasLength({ min: 1 }, 'Dietary class required'),
      type: hasLength({ min: 1 }, 'Product type required'),
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: true,

      onSubmit: async (rawValues) => {
        if (!rawValues.image?.trim().length) {
          showNotification({
            variant: Variant.FAILED,
            title: 'Product Image Required',
            desc: 'Upload a product image to proceed',
          });

          return;
        }

        const submitObject: Partial<ProductGet> = {
          ...rawValues,
        };

        if (form.isDirty()) {
          if (!params?.defaultValues?.updatedAt) {
            productCreate({
              ...submitObject,
            });
          } else {
            productUpdate({
              ...params?.defaultValues,
              ...submitObject,
            } as ProductGet);
          }
        }

        // form.reset();
        router.push(`/dashboard/products/${form.values.type?.toLocaleLowerCase()}s`);
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
