'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Group, Stack, Title } from '@mantine/core';
import BreadcrumbsDashboardAdmin from '@repo/components/common/breadcrumbs/dashboard/admin';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utilities/url';

export default function Intro() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);

  return (
    <LayoutSection
      id="partial-page-intro"
      containerized={false}
      mb={SECTION_SPACING}
    >
      <Stack justify="space-between">
        <Title order={2}>{crumbs[crumbs.length - 1].label}</Title>

        <Group>
          <BreadcrumbsDashboardAdmin props={{ crumbs }} />
        </Group>
      </Stack>
    </LayoutSection>
  );
}
