'use client';

import React from 'react';
import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar, ScrollArea } from '@mantine/core';
import { useStoreAppShell } from '@repo/store';
import HeaderShellDashboard from '../header/shell/dashboard';
import NavbarShellDashboard from '../navbar/shell/dashboard';
import { APPSHELL } from '@admin/data/constants';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { appshell } = useStoreAppShell();

  return (
    <AppShell
      layout="alt"
      withBorder={true}
      header={{ height: APPSHELL.HEADER_HEIGHT }}
      navbar={{
        width: APPSHELL.NAVBAR_WIDTH,
        breakpoint: 'sm',
        collapsed: {
          mobile: !appshell ? true : !appshell.navbar,
          desktop: !appshell ? false : !appshell.navbar,
        },
      }}
    >
      <AppShellHeader>
        <HeaderShellDashboard />
      </AppShellHeader>

      <AppShellNavbar>
        <ScrollArea h={`calc(100vh)`} type="auto" scrollbars={'y'}>
          <NavbarShellDashboard />
        </ScrollArea>
      </AppShellNavbar>

      <AppShellMain>
        <ScrollArea h={`calc(100vh - ${APPSHELL.HEADER_HEIGHT}px)`} type="auto" scrollbars={'y'}>
          {children}
        </ScrollArea>
      </AppShellMain>
    </AppShell>
  );
}
