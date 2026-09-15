'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { Box, Group, Stack, Text, Title } from '@mantine/core';
import { IconMoped, IconPizza } from '@tabler/icons-react';
import { PHONES } from '@repo/constants';
import { APP_NAME } from '@repo/constants';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { AnchorNextLink } from '@repo/ui';
import classes from './main.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { ImageDefault } from '@repo/ui';
import { images } from '@repo/constants';

export default function Main() {
  const tablet = useMediaQuery('(min-width: 48em)');

  return (
    <LayoutSection id={'header-main'} padded={'xs'}>
      <Group justify={tablet ? 'space-between' : 'center'} wrap="nowrap">
        <Box w={{ md: '40%' }} visibleFrom="md">
          <Title order={1} c={'sec'} fz={'xl'}>
            Authentic Taste that Rules!
          </Title>
        </Box>

        <Group w={{ base: '100%', md: '30%' }} justify="center" py={'md'}>
          <AnchorNextLink href="/" underline="never">
            <ImageDefault
              src={images.brand.logo.landscape.meta}
              alt={APP_NAME.WEB}
              height={{ base: 70, sm: 100, md: 120 }}
              width={{ base: 80, sm: 110, md: 130 }}
              fit="contain"
              mode="grid"
              style={{ transform: 'scale(1.3)' }}
            />
          </AnchorNextLink>
        </Group>

        <Group gap={'xl'} visibleFrom="sm" w={{ md: '40%' }} justify="end">
          {headerLinks.map((hl, i) => (
            <Text
              component="a"
              key={i}
              href={hl.link}
              target={hl.blank ? '_blank' : undefined}
              c={'inherit'}
              className={classes.link}
            >
              <Group gap={'xs'}>
                <hl.icon size={ICON_SIZE * 1.75} stroke={ICON_STROKE_WIDTH} />
                <Stack gap={0}>
                  <Text component={'span'} fz={'xs'}>
                    {hl.subLabel}
                  </Text>
                  <Text component={'span'} fz={'sm'} fw={500} c={'ter'}>
                    {hl.label}
                  </Text>
                </Stack>
              </Group>
            </Text>
          ))}
        </Group>
      </Group>
    </LayoutSection>
  );
}

const headerLinks = [
  {
    icon: IconPizza,
    link: images.menu,
    blank: true,
    label: 'Our Menu',
    subLabel: 'Download Now',
  },
  {
    icon: IconMoped,
    link: `tel:${PHONES.PHONES}`,
    blank: false,
    label: PHONES.PHONES,
    subLabel: 'Call and Order In',
  },
];
