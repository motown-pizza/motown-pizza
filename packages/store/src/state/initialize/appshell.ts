'use client';

import { useEffect } from 'react';
import { getCookieClient, getFromSessionStorage, setCookieClient } from '@repo/utils';
import { WEEK, COOKIE_NAME, SESSION_STORAGE_NAME } from '@repo/constants';
import { AppShellValue, useStoreAppShell } from '../../state/appshell';
import { useMediaQuery } from '@mantine/hooks';

export const useAppshellInitialize = (params?: { cookie?: AppShellValue }) => {
  const desktop = useMediaQuery('(min-width: 62em)');

  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);

  const cookie: AppShellValue = getCookieClient(COOKIE_NAME.APP_SHELL);

  useEffect(() => {
    // 1. Establish base defaults
    const base = params?.cookie ??
      cookie ?? {
        navbar: true,
        aside: false,
        child: { navbar: true, aside: false },
      };

    // 2. Read session storage to see if an aside view is active
    const sessionView = getFromSessionStorage(SESSION_STORAGE_NAME.VIEW);
    const hasAsideView = !!sessionView?.asideView;

    // 3. Apply Mobile Constraints & View Overrides
    // If hasAsideView is true, force aside to true (as long as we are on desktop)
    const resolvedChild = {
      navbar: desktop ? base.child.navbar : false,
      aside: desktop ? hasAsideView || base.child.aside : false,
    };

    const resolvedShell = {
      ...base,
      child: resolvedChild,
    };

    setTimeout(() => {
      setCookieClient(COOKIE_NAME.APP_SHELL, resolvedShell, {
        expiryInSeconds: WEEK,
      });
    }, 100);

    setAppShell(resolvedShell);
  }, [desktop, setAppShell]);

  useEffect(() => {
    if (appshell === undefined) return;

    setTimeout(() => {
      setCookieClient(COOKIE_NAME.APP_SHELL, appshell, {
        expiryInSeconds: WEEK,
      });
    }, 100);
  }, [appshell]);
};
