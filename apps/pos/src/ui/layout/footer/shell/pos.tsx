'use client';

import React from 'react';
import { ActionIcon, Box, Button, Group } from '@mantine/core';
import { posLinks } from '@pos/data/links';
import { AnchorNextLink } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { usePathname, useRouter } from 'next/navigation';
import { IconPlus } from '@tabler/icons-react';
import { ModalCrudOrder } from '@repo/ui';

export default function Pos() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box pos={'relative'}>
      <Group justify="space-between" grow gap={'xl'} style={{ position: 'relative', zIndex: 0 }}>
        {posLinks.map((pl, i) => {
          const active = pathname.includes(pl.link);

          return (
            <AnchorNextLink key={i} href={pl.link}>
              <Button
                fullWidth
                size="md"
                variant={
                  i == 0 ? (pathname == '/pos' ? 'filled' : 'light') : active ? 'filled' : 'light'
                }
                leftSection={
                  pl.icon ? <pl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} /> : undefined
                }
                style={{ zIndex: 2 }}
              >
                {pl.label}
              </Button>
            </AnchorNextLink>
          );
        })}
      </Group>

      <Group justify={'center'}>
        <Box style={{ position: 'absolute', top: -40, zIndex: 1 }}>
          <ModalCrudOrder>
            <ActionIcon
              size={ICON_WRAPPER_SIZE * 2.5}
              radius={99}
              color="sec"
              c={'dark.9'}
              onClick={() => {
                if (pathname !== '/pos') {
                  router.push('/pos');
                }
              }}
            >
              <IconPlus size={ICON_SIZE * 2.5} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </ModalCrudOrder>
        </Box>
      </Group>
    </Box>
  );
}
