'use client';

import React, { useState } from 'react';
import { Group } from '@mantine/core';
import { ICON_WRAPPER_SIZE } from '@repo/constants';
import { MenuUser } from '@repo/ui';
import { AvatarMain } from '@repo/ui';
import { IndicatorNetworkStatus } from '@repo/ui';
import { useStoreSyncStatus } from '@repo/store';
import { IndicatorTheme } from '@repo/ui';
import { ButtonFullscreen } from '@repo/ui';
import { ButtonNotifications } from '@repo/ui';
import { ButtonAppshellNavbar } from '@repo/ui';
import { InputTextSearch } from '@repo/ui';
import { useStoreAppShell } from '@repo/store';

export default function Dashboard() {
  const { syncStatus } = useStoreSyncStatus();
  const { appshell } = useStoreAppShell();

  const [search, setSearch] = useState('');

  // const handleToogle = () => {
  //   if (!appshell) return;
  //   setAppShell({ ...appshell, navbar: !appshell.navbar });
  // };

  return (
    <Group justify="space-between" h={'100%'} px={'lg'}>
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
          width={50}
          fit={'cont'}
          alt={APP_NAME.ADMIN}
        /> */}
      </Group>

      <Group justify="end">
        <IndicatorNetworkStatus props={{ syncStatus: syncStatus }} />

        {/* <ButtonNotifications /> */}

        <IndicatorTheme />

        <ButtonNotifications />

        <ButtonFullscreen />

        <MenuUser>
          <AvatarMain size={ICON_WRAPPER_SIZE + 4} />
        </MenuUser>
      </Group>
    </Group>
  );
}
