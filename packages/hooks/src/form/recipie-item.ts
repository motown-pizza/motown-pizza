'use client';

import { hasLength } from '@mantine/form';
import { useRecipieItemActions } from '@repo/store';
import { useFormBase } from '../form';
import { RecipieItemGet } from '@repo/types';
import { Status } from '@repo/types';
import { useRouter } from 'next/navigation';

export const useFormRecipieItem = (params?: {
  defaultValues?: Partial<RecipieItemGet>;
  options?: { close?: () => void };
}) => {
  const { recipieItemCreate, recipieItemUpdate } = useRecipieItemActions();
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<Partial<RecipieItemGet>>(
    {
      ingredientId: params?.defaultValues?.ingredientId || '',
      productVariantId: params?.defaultValues?.productVariantId || '',
      quantityNeeded: params?.defaultValues?.quantityNeeded || 0,
      unit: (params?.defaultValues?.unit || '') as any,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      ingredientId: hasLength({ min: 1 }, 'Recipie ingredient required'),
      productVariantId: hasLength({ min: 1 }, 'Product variant required'),
      quantityNeeded: (value) => (!value || value < 1) && 'Quantity required',
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: false,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<RecipieItemGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          recipieItemCreate({
            ...submitObject,
          });
        } else {
          recipieItemUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as RecipieItemGet);
        }

        form.reset();
        // router.push(`/dashboard/recipie-items`);
        if (params?.options?.close) params?.options?.close();
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
