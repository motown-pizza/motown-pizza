'use client';

import { hasLength } from '@mantine/form';
import { useIngredientActions } from '@repo/store';
import { useFormBase } from '../form';
import { IngredientGet } from '@repo/types';
import { Status } from '@repo/types';
import { useRouter } from 'next/navigation';

export const useFormIngredient = (params?: { defaultValues?: Partial<IngredientGet> }) => {
  const { ingredientCreate, ingredientUpdate } = useIngredientActions();
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<Partial<IngredientGet>>(
    {
      name: params?.defaultValues?.name || '',
      stockQuantity: params?.defaultValues?.stockQuantity || 0,
      lowStockMargin: params?.defaultValues?.lowStockMargin || 0,
      stockoutMargin: params?.defaultValues?.stockoutMargin || 0,
      stockCapacity: params?.defaultValues?.stockCapacity || 0,
      unit: (params?.defaultValues?.unit || '') as any,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      name: hasLength({ min: 2, max: 48 }, 'Between 2 and 48 characters'),
      unit: hasLength({ min: 1 }, 'Ingredient stock unit required'),
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: false,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<IngredientGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          ingredientCreate({
            ...submitObject,
          });
        } else {
          ingredientUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as IngredientGet);
        }

        form.reset();
        router.push(`/dashboard/ingredients/stock`);
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
