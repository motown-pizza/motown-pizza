'use client';

import React from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  ScrollArea,
} from '@mantine/core';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import HeaderShellDashboard from '../header/shell/dashboard';
import NavbarShellDashboard from '../navbar/shell/dashboard';
import { APPSHELL } from '@/data/constants';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { appshell } = useStoreAppShell();

  return (
    <AppShell
      layout="alt"
      withBorder={false}
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

      <AppShellNavbar
        bg={
          'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))'
        }
      >
        <ScrollArea h={`calc(100vh)`} type="auto" scrollbars={'y'}>
          <NavbarShellDashboard />
        </ScrollArea>
      </AppShellNavbar>

      <AppShellMain>
        <ScrollArea
          h={`calc(100vh - ${APPSHELL.HEADER_HEIGHT}px)`}
          type="auto"
          scrollbars={'y'}
        >
          {children}
        </ScrollArea>
      </AppShellMain>
    </AppShell>
  );
}
