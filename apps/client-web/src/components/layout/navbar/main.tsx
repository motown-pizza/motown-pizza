'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  Divider,
  Flex,
  Group,
  Indicator,
  NumberFormatter,
  Text,
} from '@mantine/core';
import { links } from '@/data/links';
import NextLink from '@repo/components/common/anchor/next-link';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import classes from './main.module.scss';
import { IconShoppingCart, IconUser } from '@tabler/icons-react';
import DrawerNav from '@/components/common/drawer/nav';
import { useMediaQuery } from '@mantine/hooks';
import ModalSignIn from '@/components/common/modal/sign-in';
import DrawerCart from '@/components/common/drawer/cart';
import { useStoreCart } from '@/libraries/zustand/stores/cart';

export default function Main() {
  const tablet = useMediaQuery('(min-width: 62em)');
  const { cart } = useStoreCart();

  return (
    <LayoutSection
      id={'navbar-main'}
      bg={'var(--mantine-color-pri-6)'}
      padded={'lg'}
    >
      <Flex
        justify="space-between"
        direction={tablet ? undefined : 'row-reverse'}
        style={{ borderRadius: 'var(--mantine-radius-lg)' }}
      >
        <Group visibleFrom="md">
          {links.map((li, i) => (
            <Group key={i}>
              {i > 0 && (
                <Divider
                  orientation="vertical"
                  h={24}
                  color="dark.0"
                  size={ICON_STROKE_WIDTH}
                />
              )}

              <NextLink
                href={li.link}
                fw={'bold'}
                tt={'uppercase'}
                underline="never"
                className={classes.link}
              >
                {li.label}
              </NextLink>
            </Group>
          ))}
        </Group>

        <Group>
          <ModalSignIn>
            <Group c={'white'} style={{ cursor: 'pointer' }}>
              <IconUser size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
            </Group>
          </ModalSignIn>

          <DrawerCart>
            <div style={{ cursor: 'pointer' }}>
              <Indicator
                color="sec"
                label={
                  cart === undefined ? undefined : (
                    <NumberFormatter value={cart?.length} />
                  )
                }
                processing={cart === undefined}
                size={16}
                styles={{ indicator: { color: 'var(--mantine-color-body)' } }}
              >
                <Group c={'white'}>
                  <IconShoppingCart
                    size={ICON_SIZE + 4}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </Group>
              </Indicator>
            </div>
          </DrawerCart>

          <>
            <Divider
              orientation="vertical"
              h={24}
              color="dark.0"
              size={ICON_STROKE_WIDTH}
              visibleFrom="md"
            />

            <NextLink
              href={'/contact'}
              fw={'bold'}
              tt={'uppercase'}
              underline="never"
              className={classes.link}
              visibleFrom="md"
            >
              Contact
            </NextLink>
          </>
        </Group>

        <Group hiddenFrom="md">
          <DrawerNav links={links} />
        </Group>
      </Flex>
    </LayoutSection>
  );
}
