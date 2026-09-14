'use client';

import { useStoreProfile } from '../profile';
import { useStoreSession } from '../session';
import { ProfileGet } from '@repo/types';
import { Role, Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

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
      firstName: params.firstName || '',
      lastName: params.lastName || '',
      email: params.email || '',
      phone: params.phone || '',
      customized: params.customized || false,
      role: params.role || Role.USER,
      userName: params.userName || '',
      status: params.status || Status.DRAFT,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params.createdAt || now).toISOString() as any,
      updatedAt: new Date(params.updatedAt || now).toISOString() as any,
    };

    addProfile(newProfile);

    // showNotification({
    //   variant: Variant.SUCCESS,
    //   title: 'Person Added',
    //   desc: `'${newProfile.firstName || newProfile.email}' has been added`,
    // });
  };

  const profileUpdate = (params: ProfileGet) => {
    if (!session) return;

    const now = new Date();

    const newProfile: ProfileGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateProfile(newProfile);

    // showNotification({
    //   variant: Variant.SUCCESS,
    //   title: 'Person Updated',
    //   desc: `'${newProfile.firstName || newProfile.email}' has been updated`,
    // });
  };

  const profileDelete = (params: ProfileGet) => {
    if (!session) return;

    const now = new Date();

    deleteProfile({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });
  };

  return { profileCreate, profileUpdate, profileDelete };
};
