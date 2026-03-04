'use client';

import React from 'react';
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
} from '@mantine/core';

export default function Search({
  props,
  children,
}: {
  props: { opened: boolean; setOpened: any; setSearchValue: any };
  children: React.ReactNode;
}) {
  return (
    <Menu
      opened={props.opened}
      onChange={() => {}}
      width={320}
      position="bottom-start"
      trapFocus={false}
      returnFocus={false}
      closeOnItemClick={false}
    >
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown>
        <MenuLabel>Products</MenuLabel>
        <MenuItem
          onClick={() => {
            props.setOpened(false);
            props.setSearchValue('');
          }}
        >
          Product1
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
