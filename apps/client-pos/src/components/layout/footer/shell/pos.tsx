'use client';

import React from 'react';
import { Button, Group } from '@mantine/core';
import { posLinks } from '@/data/links';
import NextLink from '@repo/components/common/anchor/next-link';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';

export default function Pos() {
  const pathname = usePathname();

  return (
    <div>
      <Group justify="space-between" gap={'xs'} grow>
        {posLinks.map((pl, i) => {
          const active = pathname.includes(pl.link);

          return (
            <NextLink key={i} href={pl.link}>
              <Button
                fullWidth
                variant={active ? 'filled' : 'light'}
                leftSection={
                  pl.icon ? (
                    <pl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  ) : undefined
                }
              >
                {pl.label}
              </Button>
            </NextLink>
          );
        })}
      </Group>
    </div>
  );
}
