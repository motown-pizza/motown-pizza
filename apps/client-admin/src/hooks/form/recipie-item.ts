import { hasLength } from '@mantine/form';
import { useRecipieItemActions } from '@repo/hooks/actions/recipie-item';
import { useFormBase } from '../form';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { MeasurementUnitType, Status } from '@repo/types/models/enums';

export const useFormRecipieItem = (params?: {
  defaultValues?: Partial<RecipieItemGet>;
}) => {
  const { recipieItemCreate, recipieItemUpdate } = useRecipieItemActions();

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<RecipieItemGet>
  >(
    {
      ingredient_id: params?.defaultValues?.ingredient_id || '',
      product_variant_id: params?.defaultValues?.product_variant_id || '',
      quantity_needed: params?.defaultValues?.quantity_needed || 0,
      unit: (params?.defaultValues?.unit || '') as any,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      ingredient_id: hasLength({ min: 1 }, 'Recipie ingredient required'),
      product_variant_id: hasLength({ min: 1 }, 'Product variant required'),
      quantity_needed: (value) => (!value || value < 1) && 'Quantity required',
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<RecipieItemGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updated_at) {
          recipieItemCreate({
            ...submitObject,
          });
        } else {
          recipieItemUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as RecipieItemGet);
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
