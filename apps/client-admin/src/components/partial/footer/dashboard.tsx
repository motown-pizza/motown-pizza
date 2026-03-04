'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Anchor, Group, Text } from '@mantine/core';
import { COMPANY_NAME } from '@repo/constants/app';
import { APPSHELL } from '@/data/constants';

export default function Dashboard() {
  return (
    <LayoutSection id={'footer-pizzas'} containerized={false} px={'lg'}>
      <Group
        justify="space-between"
        c={'dimmed'}
        fz={'sm'}
        h={APPSHELL.FOOTER_HEIGHT}
      >
        <Group>
          <Text inherit>
            {new Date().getFullYear()} &copy; {COMPANY_NAME}.
          </Text>
        </Group>

        <Group>
          <Text inherit>
            Designed and deveoped by{' '}
            <Anchor inherit fw={500} href="https://kevon.net" target="_blank">
              Kevon
            </Anchor>
            .
          </Text>
        </Group>
      </Group>
    </LayoutSection>
  );
}
