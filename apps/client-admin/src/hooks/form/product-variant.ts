import { hasLength } from '@mantine/form';
import { useProductVariantActions } from '@repo/hooks/actions/product-variant';
import { useFormBase } from '../form';
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { Size, Status } from '@repo/types/models/enums';

export const useFormProductVariant = (params?: {
  defaultValues?: Partial<ProductVariantGet>;
}) => {
  const { productVariantCreate, productVariantUpdate } =
    useProductVariantActions();

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<ProductVariantGet>
  >(
    {
      measurement: params?.defaultValues?.measurement || '',
      price: params?.defaultValues?.price || 0,
      product_id: params?.defaultValues?.product_id || '',
      size: params?.defaultValues?.size || Size.MEDIUM,
      title: params?.defaultValues?.title || '',
      status: params?.defaultValues?.status || Status.ACTIVE,
    },
    {
      measurement: hasLength({ max: 48 }, 'Max 48 characters'),
      price: (value) => (!value || value < 1) && 'Price required',
      size: hasLength({ min: 1 }, 'Variant size required'),
      status: hasLength({ min: 1 }, 'Variant status required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<ProductVariantGet> = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updated_at) {
          productVariantCreate({
            ...submitObject,
          });
        } else {
          productVariantUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ProductVariantGet);
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
