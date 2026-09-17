'use client';

import { hasLength, UseFormReturnType } from '@mantine/form';
import { useFormBase } from '../form';
import { useRef, useState } from 'react';
import { generateUUID } from '@repo/utils';
import { useRouter } from 'next/navigation';
import { useStoreOrderPlacement } from '@repo/store';
import { useOrderActions } from '@repo/store';
import { defaultOrderDetails } from '@repo/constants';
import { OrderFulfilmentType, OrderStatus, Status, SyncStatus } from '@repo/types';
import { stores } from '@repo/constants';
import { OrderGet } from '@repo/types';
import { useNotification } from '@repo/notifications';

export type FormOrder = ReturnType<typeof useFormOrder>['form'];

export const useFormOrder = (params?: {
  defaultValues?: Partial<OrderGet>;
  options?: { admin?: boolean };
  close?: () => void;
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
      customerName: params?.defaultValues?.customerName || '',
      customerPhone: params?.defaultValues?.customerPhone || '',
      fulfillmentType: params?.defaultValues?.fulfillmentType || OrderFulfilmentType.DELIVERY,
      orderStatus: params?.defaultValues?.orderStatus || OrderStatus.DRAFT,
      guestCount: params?.defaultValues?.guestCount || 1,
      status: params?.defaultValues?.status || Status.DRAFT,
    },
    {
      customerName: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      customerPhone: hasLength({ min: 7, max: 15 }, 'Between 7 and 15 characters'),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: !params?.options?.admin,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<OrderGet> = {
          ...(orderDetails || defaultOrderDetails),
          ...params?.defaultValues,
          ...rawValues,
          syncStatus: SyncStatus.PENDING,
          guestCount: !withGuests ? null : form.values.guestCount,
          id: orderIdRef.current,
        };

        if (!params?.defaultValues?.updatedAt) {
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
            form.values.fulfillmentType == OrderFulfilmentType.DINE_IN
              ? '/pos/tables'
              : '/pos/menu';

          router.push(`${nextPath}?orderId=${submitObject.id}`);
        }

        if (params?.close) params.close();

        orderIdRef.current = generateUUID();
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
    withGuests,
    setWithGuests,
  };
};
