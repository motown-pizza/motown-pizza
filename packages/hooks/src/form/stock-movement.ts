'use client';

import { hasLength } from '@mantine/form';
import { useStockMovementActions } from '@repo/store';
import { useFormBase } from '../form';
import { StockMovementGet } from '@repo/types';
import { Status, StockMovementType } from '@repo/types';
import { useRouter } from 'next/navigation';
import { useIngredientActions } from '@repo/store';
import { useStoreIngredient } from '@repo/store';

export const useFormStockMovement = (params?: { defaultValues?: Partial<StockMovementGet> }) => {
  const { stockMovementCreate, stockMovementUpdate } = useStockMovementActions();
  const { ingredients } = useStoreIngredient();
  const { ingredientUpdate } = useIngredientActions();
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<Partial<StockMovementGet>>(
    {
      quantity: params?.defaultValues?.quantity || 0,
      type: params?.defaultValues?.type || StockMovementType.PURCHASE,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {},
    {
      resetOnSuccess: false,
      hideSuccessNotification: false,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<StockMovementGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          stockMovementCreate({
            ...submitObject,
          });
        } else {
          stockMovementUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as StockMovementGet);

          const ingredient = ingredients?.find((i) => i.id == params.defaultValues?.ingredientId);

          if (ingredient) {
            const addition = rawValues.type == StockMovementType.PURCHASE;

            ingredientUpdate({
              ...ingredient,
              stockQuantity: addition
                ? ingredient.stockQuantity + Number(rawValues.quantity)
                : ingredient.stockQuantity - Number(rawValues.quantity),
            });
          }
        }

        form.reset();
        router.push(`/dashboard/ingredient/stock-movement`);
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
