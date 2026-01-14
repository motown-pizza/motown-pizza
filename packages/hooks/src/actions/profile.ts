import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { ProfileGet } from '@repo/types/models/profile';
import { Role, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';

export const useProfileActions = () => {
  const { session } = useStoreSession();
  const { addProfile, updateProfile, deleteProfile } = useStoreProfile();
  const { showNotification } = useNotification();

  const profileCreate = (params: Partial<ProfileGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newProfile: ProfileGet = {
      id: params.id || id,
      avatar: params.avatar || '',
      bio: params.bio || '',
      first_name: params.first_name || '',
      last_name: params.last_name || '',
      email: params.email || '',
      phone: params.phone || '',
      role: params.role || Role.USER,
      user_name: params.user_name || '',
      status: params.status || Status.DRAFT,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addProfile(newProfile);
    showNotification({
      variant: Variant.SUCCESS,
      title: 'Person Added',
      desc: `'${newProfile.first_name || newProfile.email}' has been added`,
    });
  };

  const profileUpdate = (params: ProfileGet) => {
    if (!session) return;

    const now = new Date();

    const newProfile: ProfileGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateProfile(newProfile);
    showNotification({
      variant: Variant.SUCCESS,
      title: 'Person Updated',
      desc: `'${newProfile.first_name || newProfile.email}' has been updated`,
    });
  };

  const profileDelete = (params: ProfileGet) => {
    if (!session) return;

    const now = new Date();

    deleteProfile({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { profileCreate, profileUpdate, profileDelete };
};
