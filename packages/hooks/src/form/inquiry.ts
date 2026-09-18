'use client';

import { capitalizeWords } from '@repo/utils';
import { validators } from '@repo/utils';
import { hasLength } from '@mantine/form';
import { handleInquiry } from '@repo/handlers';
import { contactAdd } from '@repo/handlers';
import { formValuesInitialInquiry, FormValuesInquiry } from '@repo/types';
import { useFormBase } from '../form';
import { COMPANY_NAME } from '@repo/constants';
import { useStoreOrderPlacement } from '@repo/store';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import { defaultOrderDetails } from '@repo/constants';

type UseFormEmailInquiryOptions = {
  saveEmailContact?: boolean;
  close?: () => void;
  order?: boolean;
};

export const useFormEmailInquiry = (
  initialValues?: Partial<FormValuesInquiry>,
  options?: UseFormEmailInquiryOptions,
) => {
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();

  const [initializing, setInitializing] = useState(true);

  const { form, submitted, handleSubmit, reset, validate } = useFormBase<FormValuesInquiry>(
    {
      ...formValuesInitialInquiry,
      appName: COMPANY_NAME,
      ...initialValues,
    },
    {
      name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      email: (value) => validators.email(value.trim()),
      subject: hasLength({ min: 2, max: 255 }, 'Between 2 and 255 characters'),
      phone: (value) => validators.phone(value.trim()),
      message: hasLength({ min: 3, max: 2048 }, 'Between 3 and 2048 characters'),
    },
    {
      close: options?.close,
      resetOnSuccess: true,

      onSubmit: async (rawValues) => {
        const values = normalizeFormValues(rawValues);

        // --- send the inquiry ---
        const response = await handleInquiry(values);

        if (!response) throw new Error('No response from server');

        if (!response.ok) {
          const result = await response.json().catch(() => null);
          throw new Error(result?.message || 'Failed to send inquiry');
        }

        const result = await response.json();

        // Optionally save contact
        if (options?.saveEmailContact) {
          const addContact = await contactAdd(values);
          if (!addContact.ok) console.error('Failed to add email contact');
        }

        return { response, result };
      },

      onError: (error) => {
        // Optional: handle unexpected errors (caught by base hook)
        console.error('Form submission error:', error);
      },
    },
  );

  useEffect(() => {
    if (!initializing) return;

    if (orderDetails === undefined) return;
    if (!orderDetails) return;

    form.setValues({ ...initialValues });

    setTimeout(() => {
      setInitializing(false);
    }, 500);
  }, [orderDetails]);

  const debouncedsetOrderDetails = useDebouncedCallback(setOrderDetails, 500);

  useEffect(() => {
    if (initializing) return;

    if (orderDetails === undefined) return;
    if (!orderDetails) return;

    if (!options?.order) return;

    debouncedsetOrderDetails({
      ...(orderDetails || defaultOrderDetails),
      customerName: form.values.name,
      customerPhone: form.values.phone,
    });
  }, [form.values]);

  return {
    form,
    submitted,
    handleSubmit,
    reset,
    validate,
  };
};

const normalizeFormValues = (v: FormValuesInquiry): FormValuesInquiry => ({
  ...v,
  name: capitalizeWords(v.name.trim()),
  email: v.email.trim().toLowerCase(),
  subject: v.subject.trim(),
  phone: v.phone.trim(),
  message: v.message.trim(),
});
