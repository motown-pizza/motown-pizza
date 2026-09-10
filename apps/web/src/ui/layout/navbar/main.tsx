'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { Divider, Flex, Group, Indicator, NumberFormatter } from '@mantine/core';
import { links } from '@web/data/links';
import { AnchorNextLink } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import classes from './main.module.css';
import { IconShoppingCart } from '@tabler/icons-react';
import DrawerNav from '@web/ui/common/drawer/nav';
import { useMediaQuery } from '@mantine/hooks';
import DrawerCart from '@web/ui/common/drawer/cart';
import { useStoreCartItem } from '@repo/store';
import { AvatarMain } from '@repo/ui';
import { MenuUser } from '@repo/ui';

export default function Main() {
  const tablet = useMediaQuery('(min-width: 62em)');
  const { cartItems } = useStoreCartItem();

  return (
    <LayoutSection id={'navbar-main'} bg={'var(--mantine-color-pri-6)'} padded={'lg'}>
      <Flex
        justify="space-between"
        direction={tablet ? undefined : 'row-reverse'}
        style={{ borderRadius: 'var(--mantine-radius-lg)' }}
      >
        <Group visibleFrom="md">
          {links.map((li, i) => (
            <Group key={i}>
              {i > 0 && (
                <Divider orientation="vertical" h={24} color="dark.0" size={ICON_STROKE_WIDTH} />
              )}

              <AnchorNextLink
                href={li.link}
                fw={'bold'}
                tt={'uppercase'}
                underline="never"
                className={classes.link}
              >
                {li.label}
              </AnchorNextLink>
            </Group>
          ))}
        </Group>

        <Group>
          <Group c={'white'} style={{ cursor: 'pointer' }}>
            <MenuUser>
              <AvatarMain />
            </MenuUser>
          </Group>

          <DrawerCart>
            <div style={{ cursor: 'pointer' }}>
              <Indicator
                color="sec"
                label={
                  cartItems === undefined ? undefined : (
                    <NumberFormatter value={cartItems?.length} />
                  )
                }
                processing={cartItems === undefined}
                size={16}
                styles={{ indicator: { color: 'var(--mantine-color-body)' } }}
              >
                <Group c={'white'}>
                  <IconShoppingCart size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
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

            <AnchorNextLink
              href={'/contact'}
              fw={'bold'}
              tt={'uppercase'}
              underline="never"
              className={classes.link}
              visibleFrom="md"
            >
              Contact
            </AnchorNextLink>
          </>
        </Group>

        <Group hiddenFrom="md">
          <DrawerNav links={links} />
        </Group>
      </Flex>
    </LayoutSection>
  );
}
