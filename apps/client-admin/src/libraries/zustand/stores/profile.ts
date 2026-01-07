import { create } from 'zustand';
import type { ProfileGet } from '@repo/types/models/profile';

export type ProfilesValue = ProfileGet[] | null | undefined;

interface ProfileState {
  profiles: ProfilesValue;
  deleted: ProfileGet[];
  setProfiles: (data: ProfilesValue) => void;
  setDeletedProfiles: (data: ProfilesValue) => void;
  clearProfiles: () => void;
  clearDeletedProfiles: () => void;
  addProfile: (data: ProfileGet) => void;
  updateProfile: (data: ProfileGet) => void;
  deleteProfile: (data: ProfileGet) => void;
}

export const useStoreProfile = create<ProfileState>((set) => ({
  profiles: undefined,
  deleted: [],

  setProfiles: (data) => {
    set({ profiles: data });
  },

  setDeletedProfiles: (data) => {
    set({ deleted: data || [] });
  },

  clearProfiles: () => {
    set({ profiles: [] });
  },

  clearDeletedProfiles: () => {
    set({ deleted: [] });
  },

  addProfile: (data) => {
    set((state) => ({
      profiles: [...(state.profiles ?? []), data],
    }));
  },

  updateProfile: (data) => {
    set((state) => ({
      profiles:
        state.profiles?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteProfile: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      profiles: state.profiles?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
