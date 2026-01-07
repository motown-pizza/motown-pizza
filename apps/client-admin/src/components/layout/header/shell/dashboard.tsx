'use client';

import React from 'react';
import { Box, Burger, Group, Skeleton } from '@mantine/core';
import { useStoreAppShell } from '@/libraries/zustand/stores/shell';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { APP_NAME } from '@/data/constants';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import MenuUser from '@/components/common/menu/user';
import AvatarMain from '@/components/common/avatars/main';

export default function Dashboard() {
  const { appshell, setAppShell } = useStoreAppShell();

  const handleToogle = () => {
    if (!appshell) return;
    setAppShell({ ...appshell, navbar: !appshell.navbar });
  };

  return (
    <Group justify="space-between" h={'100%'} px={'md'}>
      <Group>
        <Box hiddenFrom="sm">
          {appshell === undefined ? (
            <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
          ) : (
            <Burger
              opened={appshell?.navbar}
              onClick={handleToogle}
              size="sm"
            />
          )}
        </Box>

        <ImageDefault
          src={images.brand.logo.dark}
          height={32}
          width={200}
          fit="contain"
          alt={APP_NAME}
        />
      </Group>

      <Group justify="end">
        <MenuUser>
          <AvatarMain />
        </MenuUser>
      </Group>
    </Group>
  );
}
