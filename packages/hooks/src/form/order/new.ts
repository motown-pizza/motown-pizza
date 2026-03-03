/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { capitalizeWords } from '@repo/utilities/string';
import { hasLength } from '@mantine/form';
import { handleInquiry } from '@repo/handlers/requests/email/inquiry';
import { contactAdd } from '@repo/handlers/requests/contact';
import {
  formValuesInitialOrderNew,
  FormValuesOrderNew,
} from '@repo/types/form';
import { useFormBase } from '../../form';
import { useRef } from 'react';
import { generateUUID } from '@repo/utilities/generators';
import { useRouter } from 'next/navigation';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { useOrderActions } from '@repo/hooks/actions/order';
import { defaultOrderDetails } from '@/data/orders';
import { OrderFulfilmentType, SyncStatus } from '@repo/types/models/enums';
import { stores } from '@repo/constants/stores';
import { OrderGet } from '@repo/types/models/order';

type UseFormEmailInquiryOptions = {
  saveEmailContact?: boolean;
  close?: () => void;
};

export const useFormOrderNew = (
  initialValues?: Partial<FormValuesOrderNew>,
  options?: UseFormEmailInquiryOptions
) => {
  const orderIdRef = useRef(generateUUID());
  const router = useRouter();

  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  const { form, submitted, handleSubmit, reset, validate } =
    useFormBase<FormValuesOrderNew>(
      {
        ...formValuesInitialOrderNew,
        ...initialValues,
      },
      {
        name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
        phone: hasLength({ min: 7, max: 15 }, 'Between 7 and 15 characters'),
      },
      {
        close: options?.close,
        resetOnSuccess: true,
        hideSuccessNotification: true,

        onSubmit: async (rawValues) => {
          const values = normalizeFormValues(rawValues);

          const orderObject: OrderGet = {
            ...(orderDetails || defaultOrderDetails),
            // store_id: props.id,
            id: orderIdRef.current,
            customer_name: values.name,
            customer_phone: values.phone,
            guest_count: !values.guests ? 0 : values.guest_count,
            fulfillment_type: values.fulfillment_type,
            sync_status: SyncStatus.PENDING,
          };

          const newOrder = await orderCreate(orderObject, { stores });
          setOrderDetails({ ...orderObject, ...newOrder });

          const nextPath =
            values.fulfillment_type == OrderFulfilmentType.DINE_IN
              ? '/pos/tables'
              : '/pos/menu';

          router.push(`${nextPath}?orderId=${orderObject.id}`);
        },

        onError: (error) => {
          // Optional: handle unexpected errors (caught by base hook)
          console.error('Form submission error:', error);
        },
      }
    );

  return {
    form,
    submitted,
    handleSubmit,
    reset,
    validate,
  };
};

const normalizeFormValues = (v: FormValuesOrderNew): FormValuesOrderNew => ({
  ...v,
  name: capitalizeWords(v.name.trim()),
  phone: v.phone.trim(),
});
