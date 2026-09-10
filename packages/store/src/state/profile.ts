'use client';

import { create } from 'zustand';
import type { ProfileGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeProfiles: (data: ProfileGet[]) => void;
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
      profiles: state.profiles?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeProfiles: (incomingProfiles) => {
    set((state) => {
      if (!incomingProfiles || incomingProfiles.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.profiles) {
        return { profiles: incomingProfiles };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingProfiles.map((n) => [String(n.id), n]));

      // 1. Update existing profiles in place if fields differ
      const nextProfiles = state.profiles.map((existing) => {
        const incoming = incomingMap.get(String(existing.id));
        if (!incoming) return existing;

        // Check if any property changed
        const isDifferent = hasChanges(existing, incoming);

        if (isDifferent) {
          hasChanged = true;
          return { ...existing, ...incoming };
        }

        // Return exact same reference if nothing changed
        return existing;
      });

      // 2. Append new profiles that aren't in the store yet
      const existingIds = new Set(state.profiles.map((n) => String(n.id)));
      for (const incoming of incomingProfiles) {
        if (!existingIds.has(String(incoming.id))) {
          nextProfiles.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { profiles: nextProfiles };
    });
  },

  deleteProfile: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      profiles: state.profiles?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
