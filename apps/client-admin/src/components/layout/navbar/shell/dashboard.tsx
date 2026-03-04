'use client';

import React from 'react';
import { Box, Divider, Group, NavLink, Stack } from '@mantine/core';
import {
  IconCheese,
  IconChefHat,
  IconCircleFilled,
  IconDashboard,
  IconMilk,
  IconMoped,
  IconPaperBag,
  IconUsers,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@repo/constants/images';
import { APP_NAME } from '@repo/constants/app';
import { APPSHELL } from '@/data/constants';

export default function Dashboard() {
  const pathname = usePathname();

  const items = navlinks.map((nl, nli) => {
    if (!nl.subLinks) {
      return (
        <NavLink
          key={nli}
          component={Link}
          href={nl.link}
          label={nl.label}
          leftSection={
            <nl.icon size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
          }
          styles={{ root: { borderRadius: 'var(--mantine-radius-lg)' } }}
          active={nli == 0 ? pathname == nl.link : pathname.includes(nl.link)}
        />
      );
    }

    const subLinks = nl.subLinks.map((sl, sli) => {
      return (
        <NavLink
          key={sli}
          component={Link}
          href={sl.link}
          label={sl.label}
          leftSection={<IconCircleFilled size={ICON_SIZE / 4} />}
          styles={{ root: { borderRadius: 'var(--mantine-radius-lg)' } }}
          active={sli == 0 ? pathname == sl.link : pathname.includes(sl.link)}
        />
      );
    });

    return (
      <NavLink
        key={nli}
        label={nl.label}
        leftSection={
          <nl.icon size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
        }
        styles={{ root: { borderRadius: 'var(--mantine-radius-lg)' } }}
        active={nli == 0 ? pathname == nl.link : pathname.includes(nl.link)}
        component={Link}
        href={nl.link}
        defaultOpened={
          nli == 0 ? pathname == nl.link : pathname.includes(nl.link)
        }
      >
        <Stack gap={3}>{subLinks}</Stack>
      </NavLink>
    );
  });

  return (
    <>
      <Box
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor:
            'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))',
        }}
      >
        <Group justify="center" mih={APPSHELL.HEADER_HEIGHT} px={'sm'}>
          <ImageDefault
            src={images.brand.logo.landscape.meta}
            height={60}
            width={160}
            alt={APP_NAME.ADMIN}
          />
        </Group>
      </Box>

      <Stack p={'xs'} pl={5} gap={4}>
        {items}
      </Stack>
    </>
  );
}

const navlinks = [
  {
    link: '/dashboard',
    label: 'Overview',
    icon: IconDashboard,
  },
  {
    link: '/dashboard/products',
    label: 'Products',
    icon: IconMilk,
    subLinks: [
      {
        link: '/dashboard/products/pizzas',
        label: 'Pizzas',
      },
      {
        link: '/dashboard/products/sides',
        label: 'Sides',
      },
      {
        link: '/dashboard/products/drinks',
        label: 'Drinks',
      },
    ],
  },
  {
    link: '/dashboard/ingredients',
    label: 'Ingredients',
    icon: IconCheese,
    subLinks: [
      {
        link: '/dashboard/ingredients/stock',
        label: 'Stock',
      },
      {
        link: '/dashboard/ingredients/stock-movements',
        label: 'Stock Movements',
      },
    ],
  },
  {
    link: '/dashboard/recipie-items',
    label: 'Recipie Items',
    icon: IconChefHat,
  },
  {
    link: '/dashboard/orders',
    label: 'Orders',
    icon: IconPaperBag,
  },
  {
    link: '/dashboard/deliveries',
    label: 'Deliveries',
    icon: IconMoped,
  },
  {
    link: '/dashboard/people',
    label: 'Human Resources',
    icon: IconUsers,
    subLinks: [
      {
        link: '/dashboard/people/admins',
        label: 'Admins',
      },
      {
        link: '/dashboard/people/supervisors',
        label: 'Supervisors',
      },
      {
        link: '/dashboard/people/staff',
        label: 'Staff',
      },
      {
        link: '/dashboard/people/transporters',
        label: 'Couriers',
      },
      {
        link: '/dashboard/people/clients',
        label: 'Customers',
      },
    ],
  },
];
