'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Group, Stack, Text } from '@mantine/core';
import { IconMoped, IconPizza } from '@tabler/icons-react';
import { appName, phones } from '@repo/constants/app';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import NextLink from '@repo/components/common/anchor/next-link';
import classes from './main.module.scss';
import { useMediaQuery } from '@mantine/hooks';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';

export default function Main() {
  const tablet = useMediaQuery('(min-width: 48em)');

  return (
    <LayoutSection id={'header-main'} padded={'xs'}>
      <Group justify={tablet ? 'space-between' : 'center'}>
        <NextLink href="/" underline="never">
          <ImageDefault
            src={images.brand.logo.landscape.meta}
            alt={appName}
            height={80}
            width={160}
            mode="grid"
            style={{ transform: 'scale(1.3)' }}
          />
        </NextLink>

        <Group gap={'xl'} visibleFrom="sm">
          {headerLinks.map((hl, i) => (
            <NextLink
              key={i}
              href={hl.link}
              c={'inherit'}
              underline="never"
              className={classes.link}
            >
              <Group gap={'xs'}>
                <hl.icon size={ICON_SIZE * 1.75} stroke={ICON_STROKE_WIDTH} />
                <Stack gap={0}>
                  <Text component={'span'} fz={'xs'}>
                    {hl.subLabel}
                  </Text>
                  <Text component={'span'} fz={'sm'} fw={500} c={'ter.6'}>
                    {hl.label}
                  </Text>
                </Stack>
              </Group>
            </NextLink>
          ))}
        </Group>
      </Group>
    </LayoutSection>
  );
}

const headerLinks = [
  {
    icon: IconPizza,
    link: '/menu',
    label: 'Our Menu',
    subLabel: 'Download Now',
  },
  {
    icon: IconMoped,
    link: `tel:${phones.main}`,
    label: phones.main,
    subLabel: 'Call and Order In',
  },
];
