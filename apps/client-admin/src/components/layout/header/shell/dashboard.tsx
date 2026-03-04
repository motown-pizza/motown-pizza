'use client';

import React, { useState } from 'react';
import { Box, Group, Skeleton } from '@mantine/core';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@repo/constants/images';
import { APP_NAME } from '@repo/constants/app';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import MenuUser from '@repo/components/common/menu/user';
import AvatarMain from '@repo/components/common/avatars/main';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import ButtonFullscreen from '@repo/components/common/buttons/fullscreen';
import ButtonNotifications from '@repo/components/common/buttons/notifications';
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';
import InputTextSearch from '@repo/components/common/inputs/text/search';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';

export default function Dashboard() {
  const { syncStatus } = useStoreSyncStatus();
  const { theme, setTheme } = useStoreTheme();
  const { appshell } = useStoreAppShell();

  const [search, setSearch] = useState('');

  // const handleToogle = () => {
  //   if (!appshell) return;
  //   setAppShell({ ...appshell, navbar: !appshell.navbar });
  // };

  return (
    <Group justify="space-between" h={'100%'} px={'md'}>
      <Group>
        <ButtonAppshellNavbar />

        <InputTextSearch
          props={{
            value: search,
            setValue: setSearch,
            options: { withMenu: true },
          }}
          w={!appshell ? 400 : appshell.navbar ? 400 : 540}
          style={{ transition: '.25s all ease' }}
        />

        {/* <ImageDefault
          src={images.brand.logo.landscape.meta}
          height={40}
          width={120}
          alt={APP_NAME.ADMIN}
        /> */}
      </Group>

      <Group justify="end">
        <IndicatorNetworkStatus props={{ syncStatus: syncStatus }} />

        {/* <ButtonNotifications /> */}

        {theme === undefined ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : !theme ? null : (
          <IndicatorTheme
            props={{ colorScheme: theme, setColorScheme: setTheme }}
          />
        )}

        <ButtonNotifications />

        <ButtonFullscreen />

        <MenuUser>
          <AvatarMain size={ICON_WRAPPER_SIZE + 4} />
        </MenuUser>
      </Group>
    </Group>
  );
}
