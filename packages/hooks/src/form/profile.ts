'use client';

import { hasLength } from '@mantine/form';
import { useProfileActions } from '@repo/store';
import { useFormBase } from '../form';
import { ProfileGet } from '@repo/types';
import { Role, Status } from '@repo/types';
import { validators } from '@repo/utils';
import { useRouter } from 'next/navigation';

export const useFormProfile = (params?: { defaultValues?: Partial<ProfileGet> }) => {
  const { profileCreate, profileUpdate } = useProfileActions();
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ProfileGet>>(
    {
      bio: params?.defaultValues?.bio || '',
      firstName: params?.defaultValues?.firstName || '',
      lastName: params?.defaultValues?.lastName || '',
      email: params?.defaultValues?.email || '',
      phone: params?.defaultValues?.phone || '',
      role: params?.defaultValues?.role || Role.EMPLOYEE,
      status: params?.defaultValues?.status || Status.INACTIVE,
    },
    {
      firstName: hasLength({ min: 2, max: 48 }, 'Between 2 and 48 characters required'),
      lastName: hasLength({ min: 2, max: 48 }, 'Between 2 and 48 characters required'),
      email: (value) => validators.email((value || '').trim()),
      phone: hasLength({ min: 7, max: 15 }, 'Invalid phone number'),
      role: hasLength({ min: 1 }, 'User role required'),
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: false,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<ProfileGet> = {
          ...rawValues,
          userName: `${rawValues.firstName}_${rawValues.lastName}`,
        };

        if (!params?.defaultValues?.updatedAt) {
          profileCreate({
            ...submitObject,
          });
        } else {
          profileUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ProfileGet);
        }

        form.reset();
        router.push(`/dashboard/people/${form.values.role?.toLocaleLowerCase()}s`);
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
