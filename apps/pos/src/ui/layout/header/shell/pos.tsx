'use client';

import React, { useState } from 'react';
import { Grid, GridCol, Group } from '@mantine/core';
import { useStoreAppShell } from '@repo/store';
import { ImageDefault } from '@repo/ui';
import { ICON_WRAPPER_SIZE, images } from '@repo/constants';
import { APP_NAME } from '@repo/constants';
import { MenuUser } from '@repo/ui';
import { AvatarMain } from '@repo/ui';
import { IndicatorNetworkStatus } from '@repo/ui';
import { useStoreSyncStatus } from '@repo/store';
import { ButtonFullscreen } from '@repo/ui';
import { IndicatorTheme } from '@repo/ui';
import { InputTextSearch } from '@repo/ui';
import { APP_SHELL } from '@pos/data/constants';

export default function Pos() {
  const { appshell, setAppShell } = useStoreAppShell();
  const { syncStatus } = useStoreSyncStatus();

  const [search, setSearch] = useState('');

  const handleToogle = () => {
    if (!appshell) return;
    setAppShell({ ...appshell, navbar: !appshell.navbar });
  };

  return (
    <Grid align="center" gap={0}>
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
            height={APP_SHELL.HEADER_HEIGHT - 20}
            width={APP_SHELL.HEADER_HEIGHT - 10}
            fit="contain"
            alt={APP_NAME.POS}
            style={{ transform: 'scale(1.2)' }}
          />
        </Group>
      </GridCol>

      <GridCol span={6}>
        <Group justify="center">
          <InputTextSearch
            props={{ value: search, setValue: setSearch }}
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

          <IndicatorTheme />

          <ButtonFullscreen />

          <MenuUser>
            <AvatarMain size={ICON_WRAPPER_SIZE + 4} />
          </MenuUser>
        </Group>
      </GridCol>
    </Grid>
  );
}
