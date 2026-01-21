'use client';

import React from 'react';
import { useState } from 'react';
import { ActionIcon, TextInput, TextInputProps } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';

export default function Search({ ...restProps }: {} & TextInputProps) {
  const [value, setValue] = useState('');

  return (
    <TextInput
      placeholder="Search..."
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      leftSection={
        <IconSearch size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
      }
      rightSection={
        !value ? undefined : (
          <ActionIcon
            size={ICON_WRAPPER_SIZE - 4}
            variant="subtle"
            color={'gray'}
            onClick={() => setValue('')}
          >
            <IconX size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        )
      }
      {...restProps}
    />
  );
}
