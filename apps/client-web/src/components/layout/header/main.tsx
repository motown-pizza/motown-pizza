'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Card, Divider, Group, Stack, Text } from '@mantine/core';
import { IconMoped, IconPizza } from '@tabler/icons-react';
import { phones } from '@repo/constants/app';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import NextLink from '@repo/components/common/anchor/next-link';
import classes from './main.module.scss';
import { useMediaQuery } from '@mantine/hooks';

export default function Main() {
  const tablet = useMediaQuery('(min-width: 48em)');

  return (
    <LayoutSection id={'header-main'} padded={'xs'}>
      <Group justify={tablet ? 'space-between' : 'center'}>
        <NextLink href="/" underline="never">
          <Card
            py={5}
            px={'xs'}
            withBorder
            ta={'center'}
            fw={'bold'}
            tt={'uppercase'}
          >
            <Text inherit c={'pri'}>
              Motown
            </Text>

            <Divider color="ter" mb={2} />

            <Text inherit c={'sec'} fz={'xl'} lts={2}>
              Pizza
            </Text>
          </Card>
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
