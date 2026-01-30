'use client';

import React from 'react';
import { ActionIcon, Box, Button, Group } from '@mantine/core';
import { posLinks } from '@/data/links';
import NextLink from '@repo/components/common/anchor/next-link';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { usePathname, useRouter } from 'next/navigation';
import { IconPlus } from '@tabler/icons-react';
import ModalOrderNew from '@/components/common/modals/orders/new';

export default function Pos() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box>
      <Group justify="space-between" grow gap={'xl'}>
        {posLinks.map((pl, i) => {
          const active = pathname.includes(pl.link);

          return (
            <NextLink key={i} href={pl.link}>
              <Button
                fullWidth
                size="md"
                variant={
                  i == 0
                    ? pathname == '/pos'
                      ? 'filled'
                      : 'light'
                    : active
                      ? 'filled'
                      : 'light'
                }
                leftSection={
                  pl.icon ? (
                    <pl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  ) : undefined
                }
                style={{ zIndex: 2 }}
              >
                {pl.label}
              </Button>
            </NextLink>
          );
        })}
      </Group>

      <Box pos={'absolute'} left={0} top={-32} right={0}>
        <Group justify={'center'}>
          <ModalOrderNew>
            <ActionIcon
              size={ICON_WRAPPER_SIZE * 2}
              radius={99}
              onClick={() => router.push('/pos')}
            >
              <IconPlus size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </ModalOrderNew>
        </Group>
      </Box>
    </Box>
  );
}
