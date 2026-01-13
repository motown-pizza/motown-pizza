import { hasLength } from '@mantine/form';
import { useProfileActions } from '../actions/profile';
import { useFormBase } from '../form';
import { ProfileGet } from '@repo/types/models/profile';
import { Role, Status } from '@repo/types/models/enums';
import { validators } from '@repo/utilities/validation';

export const useFormProfile = (params?: {
  defaultValues?: Partial<ProfileGet>;
}) => {
  const { profileCreate, profileUpdate } = useProfileActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ProfileGet>>(
    {
      bio: params?.defaultValues?.bio || '',
      first_name: params?.defaultValues?.first_name || '',
      last_name: params?.defaultValues?.last_name || '',
      email: params?.defaultValues?.email || '',
      phone: params?.defaultValues?.phone || '',
      role: params?.defaultValues?.role || Role.EMPLOYEE,
      status: params?.defaultValues?.status || Status.INACTIVE,
    },
    {
      first_name: hasLength(
        { min: 2, max: 48 },
        'Between 2 and 48 characters required'
      ),
      last_name: hasLength(
        { min: 2, max: 48 },
        'Between 2 and 48 characters required'
      ),
      email: (value) => validators.email((value || '').trim()),
      phone: hasLength({ min: 7, max: 15 }, 'Invalid phone number'),
      role: hasLength({ min: 1 }, 'User role required'),
      status: hasLength({ min: 1 }, 'User status required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject: Partial<ProfileGet> = {
          ...rawValues,
          user_name: `${rawValues.first_name}_${rawValues.last_name}`,
        };

        if (!params?.defaultValues?.updated_at) {
          profileCreate({
            ...submitObject,
          });
        } else {
          profileUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ProfileGet);
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
