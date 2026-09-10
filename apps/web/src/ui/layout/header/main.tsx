'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { Group, Stack, Text } from '@mantine/core';
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
      <Group justify={tablet ? 'space-between' : 'center'}>
        <AnchorNextLink href="/" underline="never">
          <ImageDefault
            src={images.brand.logo.landscape.meta}
            alt={APP_NAME.WEB}
            height={80}
            width={160}
            mode="grid"
            style={{ transform: 'scale(1.3)' }}
          />
        </AnchorNextLink>

        <Group gap={'xl'} visibleFrom="sm">
          {headerLinks.map((hl, i) => (
            <AnchorNextLink
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
            </AnchorNextLink>
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
    link: `tel:${PHONES.MAIN}`,
    label: PHONES.MAIN,
    subLabel: 'Call and Order In',
  },
];
