/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { capitalizeWords } from '@repo/utilities/string';
import { hasLength, UseFormReturnType } from '@mantine/form';
import { handleInquiry } from '@repo/handlers/requests/email/inquiry';
import { contactAdd } from '@repo/handlers/requests/contact';
import {
  formValuesInitialOrderNew,
  FormValuesOrderNew,
} from '@repo/types/form';
import { useFormBase } from '../form';
import { useRef, useState } from 'react';
import { generateUUID } from '@repo/utilities/generators';
import { useRouter } from 'next/navigation';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { useOrderActions } from '@repo/hooks/actions/order';
import { defaultOrderDetails } from '@repo/constants/orders';
import {
  OrderFulfilmentType,
  OrderStatus,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { stores } from '@repo/constants/stores';
import { OrderGet } from '@repo/types/models/order';
import { useNotification } from '../notification';

export type FormOrder = UseFormReturnType<
  Partial<OrderGet>,
  (values: Partial<OrderGet>) => Partial<OrderGet>
>;

export const useFormOrder = (params?: {
  options?: { admin?: boolean };
  defaultValues?: Partial<OrderGet>;
}) => {
  const { orderCreate, orderUpdate } = useOrderActions();
  const { showNotification } = useNotification();
  const router = useRouter();
  const orderIdRef = useRef(generateUUID());
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const [withGuests, setWithGuests] = useState(false);

  const { form, submitted, handleSubmit } = useFormBase<Partial<OrderGet>>(
    {
      id: params?.defaultValues?.id || '',
      customer_name: params?.defaultValues?.customer_name || '',
      customer_phone: params?.defaultValues?.customer_phone || '',
      fulfillment_type:
        params?.defaultValues?.fulfillment_type || OrderFulfilmentType.DELIVERY,
      order_status: params?.defaultValues?.order_status || OrderStatus.DRAFT,
      guest_count: params?.defaultValues?.guest_count || 1,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      customer_name: hasLength(
        { min: 2, max: 24 },
        'Between 2 and 24 characters'
      ),
      customer_phone: hasLength(
        { min: 7, max: 15 },
        'Between 7 and 15 characters'
      ),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: false,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<OrderGet> = {
          ...(orderDetails || defaultOrderDetails),
          id: orderIdRef.current,
          guest_count: !withGuests ? 0 : form.values.guest_count,
          sync_status: SyncStatus.PENDING,
          ...rawValues,
        };

        if (!params?.defaultValues?.updated_at) {
          orderCreate({ ...submitObject }, { stores });
        } else {
          orderUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as OrderGet);
        }

        if (params?.options?.admin) {
          router.push(`/dashboard/orders`);
        } else {
          setOrderDetails({ ...submitObject } as OrderGet);

          const nextPath =
            form.values.fulfillment_type == OrderFulfilmentType.DINE_IN
              ? '/pos/tables'
              : '/pos/menu';

          router.push(`${nextPath}?orderId=${submitObject.id}`);
        }
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
    withGuests,
    setWithGuests,
  };
};
