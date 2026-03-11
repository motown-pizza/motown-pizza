import { hasLength } from '@mantine/form';
import { useStockMovementActions } from '@repo/hooks/actions/stock-movement';
import { useFormBase } from '../form';
import { StockMovementGet } from '@repo/types/models/stock-movement';
import { Status, StockMovementType } from '@repo/types/models/enums';
import { useRouter } from 'next/navigation';
import { useIngredientActions } from '../actions/ingredient';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';

export const useFormStockMovement = (params?: {
  defaultValues?: Partial<StockMovementGet>;
}) => {
  const { stockMovementCreate, stockMovementUpdate } =
    useStockMovementActions();
  const { ingredients } = useStoreIngredient();
  const { ingredientUpdate } = useIngredientActions();
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<StockMovementGet>
  >(
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

        if (!params?.defaultValues?.updated_at) {
          stockMovementCreate({
            ...submitObject,
          });
        } else {
          stockMovementUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as StockMovementGet);

          const ingredient = ingredients?.find(
            (i) => i.id == params.defaultValues?.ingredient_id
          );

          if (ingredient) {
            const addition = rawValues.type == StockMovementType.PURCHASE;

            ingredientUpdate({
              ...ingredient,
              stock_quantity: addition
                ? ingredient.stock_quantity + Number(rawValues.quantity)
                : ingredient.stock_quantity - Number(rawValues.quantity),
            });
          }
        }

        form.reset();
        router.push(`/dashboard/ingredient/stock-movement`);
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
