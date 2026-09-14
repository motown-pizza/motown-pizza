'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, MenuDivider, MenuDropdown, MenuItem, MenuTarget, Group, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { PartialUser } from '../partial/user';
import { useStoreSession } from '@repo/store';
import { navLinkItems } from '@repo/constants';

export function MenuUser({ children }: { children: React.ReactNode }) {
  const session = useStoreSession((s) => s.session);

  const mobile = useMediaQuery('(max-width: 48em)');
  const desktop = useMediaQuery('(min-width: 62em)');

  return (
    <Menu
      position="bottom-end"
      width={mobile ? 200 : 240}
      trigger="click-hover"
      opened={desktop ? undefined : false}
      disabled={!session?.email}
    >
      <MenuTarget>
        <Group component={'span'} style={{ cursor: 'pointer' }}>
          {children}
        </Group>
      </MenuTarget>

      <MenuDropdown>
        <Box pb={5}>
          <PartialUser />
        </Box>

        {/* {navLinkItems.user.account.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={<item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            component={Link}
            href={item.link}
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider /> */}

        {navLinkItems.user.activity.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={<item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            component={Link}
            href={item.link}
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider />

        {navLinkItems.user.danger.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={<item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            component={Link}
            href={item.link}
            color="red"
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
