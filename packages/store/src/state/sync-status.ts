'use client';

import { create } from 'zustand';
import { SyncStatus } from '@repo/types';

export type SyncStatusValue = SyncStatus;

interface SyncStatusState {
  syncStatus: SyncStatusValue;
  setSyncStatus: (data: SyncStatusValue) => void;
  clearSyncStatus: () => void;
}

export const useStoreSyncStatus = create<SyncStatusState>((set) => ({
  syncStatus: SyncStatus.SYNCED,

  setSyncStatus: (data) => {
    set({ syncStatus: data });
  },

  clearSyncStatus: () => {
    set({ syncStatus: undefined });
  },
}));
