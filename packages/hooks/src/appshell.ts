'use client';

import { useStoreAppShell } from '@repo/store';
import { COOKIE_NAME } from '@repo/constants';
import { WEEK } from '@repo/constants';
import { AppShell } from '@repo/types';
import { setCookieClient } from '@repo/utils';

export const useAppshellNavbar = () => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);

  const handleAppshellChange = (params: AppShell) => {
    if (!appshell) return;

    setAppShell(params);

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  return { appshell, handleAppshellChange };
};

export const useAppshellChild = () => {
  const asideChild = useStoreAppShell((s) => s.appshell?.child?.aside);
  const toggleAsideChild = useStoreAppShell((s) => s.toggleAsideChild);

  const handleToggleChildAside = () => {
    toggleAsideChild();
  };

  return { asideChild, handleToggleChildAside };
};
