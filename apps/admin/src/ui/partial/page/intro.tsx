'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { SECTION_SPACING } from '@repo/constants';
import { Group, Stack, Title } from '@mantine/core';
import { BreadcrumbDashboardAdmin } from '@repo/ui';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utils';

export default function Intro() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);

  return (
    <LayoutSection id="partial-page-intro" containerized={false} mb={SECTION_SPACING}>
      <Stack justify="space-between">
        <Title order={2}>{crumbs[crumbs.length - 1].label}</Title>

        <Group>
          <BreadcrumbDashboardAdmin props={{ crumbs }} />
        </Group>
      </Stack>
    </LayoutSection>
  );
}
