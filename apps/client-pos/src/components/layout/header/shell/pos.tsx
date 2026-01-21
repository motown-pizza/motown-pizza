'use client';

import React from 'react';
import { Box, Burger, Grid, GridCol, Group, Skeleton } from '@mantine/core';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { APP_NAME } from '@/data/constants';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import MenuUser from '@/components/common/menu/user';
import AvatarMain from '@/components/common/avatars/main';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import InputSearch from '../../../common/inputs/search';

export default function Pos() {
  const { appshell, setAppShell } = useStoreAppShell();
  const { syncStatus } = useStoreSyncStatus();
  const { theme, setTheme } = useStoreTheme();

  const handleToogle = () => {
    if (!appshell) return;
    setAppShell({ ...appshell, navbar: !appshell.navbar });
  };

  return (
    <Grid align="center" gutter={0}>
      <GridCol span={3}>
        <Group>
          {/* <Box hiddenFrom="sm">
            {appshell === undefined ? (
              <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
            ) : (
              <Burger
                opened={appshell?.navbar}
                onClick={handleToogle}
                size="sm"
              />
            )}
          </Box> */}

          <ImageDefault
            src={images.brand.logo.landscape.meta}
            height={60}
            width={120}
            alt={APP_NAME}
            style={{ transform: 'scale(1.2)' }}
          />
        </Group>
      </GridCol>

      <GridCol span={6}>
        <Group justify="center">
          <InputSearch
            w={{ md: '75%' }}
            variant="filled"
            styles={{
              input: { backgroundColor: 'var(--mantine-color-dark-7)' },
            }}
          />
        </Group>
      </GridCol>

      <GridCol span={3}>
        <Group justify="end">
          <IndicatorNetworkStatus props={{ syncStatus: syncStatus }} />

          {/* {theme === undefined ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : !theme ? null : (
          <IndicatorTheme
            props={{ colorScheme: theme, setColorScheme: setTheme }}
          />
        )} */}

          <MenuUser>
            <AvatarMain />
          </MenuUser>
        </Group>
      </GridCol>
    </Grid>
  );
}
