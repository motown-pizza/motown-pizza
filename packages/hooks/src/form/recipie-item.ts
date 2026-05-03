import { hasLength } from '@mantine/form';
import { useRecipieItemActions } from '@repo/hooks/actions/recipie-item';
import { useFormBase } from '../form';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { MeasurementUnitType, Status } from '@repo/types/models/enums';
import { useRouter } from 'next/navigation';

export const useFormRecipieItem = (params?: {
  defaultValues?: Partial<RecipieItemGet>;
  options?: { close?: () => void };
}) => {
  const { recipieItemCreate, recipieItemUpdate } = useRecipieItemActions();
  const router = useRouter();

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
      resetOnSuccess: false,
      hideSuccessNotification: false,

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

        form.reset();
        // router.push(`/dashboard/recipie-items`);
        if (params?.options?.close) params?.options?.close();
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
