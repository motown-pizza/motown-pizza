'use client';

import React from 'react';
import { NavLink, Stack } from '@mantine/core';
import { IconCalendar, IconDashboard, IconNotebook } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';
import NextLink from '@repo/components/common/anchor/next-link';

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <Stack p={'xs'} gap={3}>
      {navlinks.map((nl, i) => (
        <div key={i}>
          <NextLink href={nl.link}>
            <NavLink
              component="span"
              label={nl.label}
              leftSection={
                <nl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              styles={{ root: { borderRadius: 'var(--mantine-radius-lg)' } }}
              active={pathname.includes(nl.link)}
            />
          </NextLink>
        </div>
      ))}
    </Stack>
  );
}

const navlinks = [
  {
    link: '/products',
    label: 'Products',
    icon: IconDashboard,
  },
  {
    link: '/ingredients',
    label: 'Ingredients',
    icon: IconNotebook,
  },
  {
    link: '/orders',
    label: 'Orders',
    icon: IconCalendar,
  },
  {
    link: '/transporters',
    label: 'Transporters',
    icon: IconCalendar,
  },
];
