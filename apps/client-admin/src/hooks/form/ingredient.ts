import { hasLength } from '@mantine/form';
import { useIngredientActions } from '../actions/ingredient';
import { useFormBase } from '../form';
import { IngredientGet } from '@repo/types/models/ingredient';
import { Status } from '@repo/types/models/enums';

export const useFormIngredient = (params?: {
  defaultValues?: Partial<IngredientGet>;
}) => {
  const { ingredientCreate, ingredientUpdate } = useIngredientActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<IngredientGet>>(
    {
      name: params?.defaultValues?.name || '',
      stock_quantity: params?.defaultValues?.stock_quantity || 0,
      stockout_margin: params?.defaultValues?.stockout_margin || 20,
      unit: (params?.defaultValues?.unit || '') as any,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      name: hasLength({ min: 2, max: 48 }, 'Between 2 and 48 characters'),
      unit: hasLength({ min: 1 }, 'Ingredient stock unit required'),
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<IngredientGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updated_at) {
          ingredientCreate({
            ...submitObject,
          });
        } else {
          ingredientUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as IngredientGet);
        }
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
