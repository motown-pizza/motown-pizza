'use client';

import React from 'react';
import { useAppshellNavbar } from '@repo/hooks/app-shell';
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';

export default function Navbar() {
  const { appshell, handleAppshellChange } = useAppshellNavbar();

  const states = {
    iconLeft: !appshell?.navbar ? IconArrowBarRight : IconArrowBarLeft,
    iconRight: !appshell?.aside ? IconArrowBarLeft : IconArrowBarRight,
  };

  if (appshell === undefined)
    return <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />;

  return (
    <Group>
      <Tooltip
        label={appshell?.navbar ? 'Collapse' : 'Expand'}
        position="right"
      >
        <Group>
          <ActionIcon
            variant="subtle"
            color={'dark'}
            aria-label={appshell?.navbar ? 'Collapse' : 'Expand'}
            onClick={() => {
              if (!appshell) return;

              handleAppshellChange({
                ...appshell,
                navbar: !appshell?.navbar,
              });
            }}
            size={ICON_WRAPPER_SIZE}
          >
            <states.iconLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Group>
      </Tooltip>
    </Group>
  );
}
