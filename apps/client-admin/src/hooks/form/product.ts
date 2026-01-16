import { hasLength, UseFormReturnType } from '@mantine/form';
import { useProductActions } from '@repo/hooks/actions/product';
import { useFormBase } from '../form';
import { ProductGet } from '@repo/types/models/product';
import {
  ProductDietaryType,
  ProductType,
  Status,
} from '@repo/types/models/enums';

export type FormProduct = UseFormReturnType<
  Partial<ProductGet>,
  (values: Partial<ProductGet>) => Partial<ProductGet>
>;

export const useFormProduct = (params?: {
  defaultValues?: Partial<ProductGet>;
}) => {
  const { productCreate, productUpdate } = useProductActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ProductGet>>(
    {
      id: params?.defaultValues?.id || '',
      description: params?.defaultValues?.description || '',
      dietary_class:
        params?.defaultValues?.dietary_class || ProductDietaryType.NEUTRAL,
      image: params?.defaultValues?.image || '',
      image_id: params?.defaultValues?.image_id || '',
      type: params?.defaultValues?.type || ProductType.PIZZA,
      title: params?.defaultValues?.title || '',
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      description: hasLength({ max: 255 }, 'Max 255 characters'),
      dietary_class: hasLength({ min: 1 }, 'Dietary class required'),
      type: hasLength({ min: 1 }, 'Product type required'),
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<ProductGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updated_at) {
          productCreate({
            ...submitObject,
          });
        } else {
          productUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ProductGet);
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
