'use client';

import React from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  ScrollArea,
} from '@mantine/core';
import { useStoreAppShell } from '@/libraries/zustand/stores/shell';
import HeaderShellDashboard from '../header/shell/dashboard';
import NavbarShellDashboard from '../navbar/shell/dashboard';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { appshell } = useStoreAppShell();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
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
        <ScrollArea
          h={`calc(100vh - ${60}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={8}
        >
          <NavbarShellDashboard />
        </ScrollArea>
      </AppShellNavbar>

      <AppShellMain>
        <ScrollArea
          h={`calc(100vh - ${60}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={8}
        >
          {children}
        </ScrollArea>
      </AppShellMain>
    </AppShell>
  );
}
