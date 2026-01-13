import { hasLength } from '@mantine/form';
import { useRecipieItemActions } from '../actions/recipie-item';
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

const normalizeOperate = (
  ingredientUnit: MeasurementUnitType,
  quantityNeededUnit: MeasurementUnitType,
  ingredientQuantity: number,
  quantityNeeded: number,
  operation: 'add' | 'subtract'
) => {
  const pieces = ingredientUnit == MeasurementUnitType.PIECES;

  if (pieces) {
    if (operation == 'add') {
      return ingredientQuantity + quantityNeeded;
    } else {
      return ingredientQuantity - quantityNeeded;
    }
  }

  const solidWeight =
    ingredientUnit == MeasurementUnitType.GRAMS ||
    ingredientUnit == MeasurementUnitType.KILOGRAMS;

  if (solidWeight) {
    // convert ingredient unit to grams
    const ingredientQuantityInGrams =
      ingredientUnit == MeasurementUnitType.KILOGRAMS
        ? ingredientQuantity * 1000
        : ingredientQuantity;
    // convert quantity needed unit to grams
    const quantityNeededInGrams =
      quantityNeededUnit == MeasurementUnitType.KILOGRAMS
        ? quantityNeeded * 1000
        : quantityNeeded;

    if (operation == 'add') {
      return ingredientQuantityInGrams + quantityNeededInGrams;
    } else {
      return ingredientQuantityInGrams - quantityNeededInGrams;
    }
  } else {
    // convert ingredient unit to ml
    const ingredientQuantityInMl =
      ingredientUnit == MeasurementUnitType.LITRES
        ? ingredientQuantity * 1000
        : ingredientQuantity;
    // convert quantity needed unit to ml
    const quantityNeededInMl =
      quantityNeededUnit == MeasurementUnitType.LITRES
        ? quantityNeeded * 1000
        : quantityNeeded;

    if (operation == 'add') {
      return ingredientQuantityInMl + quantityNeededInMl;
    } else {
      return ingredientQuantityInMl - quantityNeededInMl;
    }
  }
};
