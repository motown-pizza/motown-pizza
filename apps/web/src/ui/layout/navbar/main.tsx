'use client';

import React, { useEffect, useState } from 'react';
import { ImageDefault, LayoutSection } from '@repo/ui';
import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Group,
  Indicator,
  NumberFormatter,
  Stack,
} from '@mantine/core';
import { links } from '@web/data/links';
import { AnchorNextLink } from '@repo/ui';
import {
  APP_NAME,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  images,
  PARAM_NAME,
} from '@repo/constants';
import classes from './main.module.css';
import { IconShoppingCart } from '@tabler/icons-react';
import DrawerNav from '@web/ui/common/drawer/nav';
import DrawerCart from '@web/ui/common/drawer/cart';
import { useStoreCartItem } from '@repo/store';
import { AvatarMain } from '@repo/ui';
import { MenuUser } from '@repo/ui';
import { usePathname, useSearchParams } from 'next/navigation';
import PopoverGeolocation from '@web/ui/common/popover/geolocation';

export default function Main() {
  const pathname = usePathname();
  const { cartItems } = useStoreCartItem();
  const searchParams = useSearchParams();
  const menuTab = searchParams.get(PARAM_NAME.MENU_TAB);

  return (
    <LayoutSection id={'navbar-main'} bg={'var(--mantine-color-pri-6)'} padded={'sm'}>
      <Flex justify="space-between" style={{ borderRadius: 'var(--mantine-radius-lg)' }}>
        <Group hiddenFrom="md">
          <DrawerNav links={links} />
        </Group>

        <Group visibleFrom="md">
          <AnchorNextLink href="/" underline="never" mr={'xl'}>
            <ImageDefault
              src={images.brand.logo.landscape.meta}
              alt={APP_NAME.WEB}
              height={{ base: 70 }}
              width={{ base: 80 }}
              fit="contain"
              mode="grid"
              style={{ transform: 'scale(1.3)' }}
            />
          </AnchorNextLink>

          {links.map((li, i) => {
            const active =
              pathname != '/' &&
              (menuTab ? li.link.includes(menuTab as string) : pathname.includes(li.link));

            return (
              <Stack key={i} gap={5} mih={31.4}>
                <AnchorNextLink
                  href={li.link}

                  fw={500}
                  underline="never"
                  className={classes.link}
                >
                  {li.label}
                </AnchorNextLink>

                {active && <Divider color="sec" size={2} />}
              </Stack>
            );
          })}
        </Group>

        <Group>
          <Box visibleFrom="md">
            <PopoverGeolocation />
          </Box>

          <DrawerCart>
            <Indicator
              color="sec"
              label={
                cartItems === undefined ? undefined : <NumberFormatter value={cartItems?.length} />
              }
              processing={cartItems === undefined}
              size={20}
              fw={'bold'}
              offset={{ x: 2, y: 2 }}
              withBorder
              styles={{
                indicator: {
                  color: 'var(--mantine-color-body)',
                  borderColor: 'var(--mantine-color-pri-6)',
                },
              }}
            >
              <Group c={'white'}>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE + 4}
                  color="dark"
                  style={{ overflow: 'visible', borderWidth: ICON_STROKE_WIDTH }}
                >
                  <IconShoppingCart size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>
            </Indicator>
          </DrawerCart>

          <Group c={'white'} style={{ cursor: 'pointer' }} visibleFrom="md">
            <MenuUser>
              <AvatarMain size={ICON_WRAPPER_SIZE + 4} />
            </MenuUser>
          </Group>
        </Group>
      </Flex>
    </LayoutSection>
  );
}
