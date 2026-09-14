'use client';

import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export function ButtonCopy({ clipboardItem }: { clipboardItem: any }) {
  const clipboard = useClipboard({ timeout: 1000 });
  const copyProps = { icon: clipboard.copied ? IconCheck : IconCopy };

  return (
    <Tooltip label={clipboard.copied ? 'Coppied' : 'Copy'}>
      <ActionIcon
        size={ICON_WRAPPER_SIZE - 4}
        color={clipboard.copied ? 'ter' : 'blue'}
        onClick={() => {
          clipboard.copy(clipboardItem);
        }}
      >
        <copyProps.icon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Tooltip>
  );
}
