'use client';

import React from 'react';
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  Box,
  Group,
  ScrollArea,
} from '@mantine/core';
import HeaderShellPos from '../header/shell/pos';
import FooterShellPos from '../footer/shell/pos';
import { APP_SHELL } from '@/data/constants';

export default function Pos({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: APP_SHELL.HEADER_HEIGHT }}
      footer={{ height: APP_SHELL.FOOTER_HEIGHT }}
      withBorder={false}
    >
      <AppShellHeader>
        <Group h={'100%'} grow px={'xs'}>
          <HeaderShellPos />
        </Group>
      </AppShellHeader>

      <AppShellMain bg={'var(--mantine-color-dark-8)'}>
        <ScrollArea
          h={`calc(100vh - ${APP_SHELL.HEADER_HEIGHT + APP_SHELL.FOOTER_HEIGHT}px)`}
          type="auto"
          scrollbars={'y'}
        >
          <Box p={'md'}>{children}</Box>
        </ScrollArea>
      </AppShellMain>

      <AppShellFooter>
        <Group h={'100%'} grow px={'xs'}>
          <FooterShellPos />
        </Group>
      </AppShellFooter>
    </AppShell>
  );
}
