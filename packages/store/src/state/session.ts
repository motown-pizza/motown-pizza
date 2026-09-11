'use client';

import { create } from 'zustand';
import { UserObject } from '@repo/types';

export type SessionValue = UserObject | null | undefined;

interface SessionState {
  session: SessionValue;
  setSession: (data: SessionValue) => void;
  clearSession: () => void;
}

export const useStoreSession = create<SessionState>((set) => ({
  session: undefined,

  setSession: (data) => {
    set({ session: data });
  },

  clearSession: () => {
    set({ session: undefined });
  },
}));
