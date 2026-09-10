'use client';

import { Variant } from '@repo/types';
import { validators } from '@repo/utils';
import { contactAdd } from '@repo/handlers';
import { useFormBase } from '../form';
import { useNotification } from '@repo/notifications';

export const useFormNewsletter = () => {
  const { showNotification } = useNotification();

  const { form, submitted, handleSubmit } = useFormBase<{ email: string }>(
    { email: '' },
    {
      email: (value) => validators.email(value.trim()),
    },
    {
      resetOnSuccess: true,
      onSubmit: async (rawValues) => {
        const cleanValues = { email: rawValues.email.trim().toLowerCase() };
        const response = await contactAdd(cleanValues);

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        if (!response.ok) {
          if (result.exists) {
            showNotification({ variant: Variant.WARNING }, response, result);
          } else {
            throw new Error(result?.message || 'Subscription failed');
          }
        }

        return { response, result };
      },
      onError: (error) => {
        console.error('Newsletter error:', error);
      },
    },
  );

  return { form, submitted, handleSubmit };
};
