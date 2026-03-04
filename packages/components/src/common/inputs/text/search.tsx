'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ActionIcon, TextInput, TextInputProps, Tooltip } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import SpinnerApp from '../../spinners/app';
import MenuSearch from '../../menu/search';

export default function Search({
  props,
  ...restProps
}: {
  props: { value: string; setValue: any; options?: { withMenu?: boolean } };
} & TextInputProps) {
  const [loading, setLoading] = useState(false);
  const [value, setSearchValue] = useState(props.value);

  useEffect(() => {
    setSearchValue(props.value);
  }, [props.value]);

  const debounceHandleChange = useDebouncedCallback(async (v: string) => {
    props.setValue(v);
    setLoading(false);
  }, 500);

  const handleChange = (v: string) => {
    setSearchValue(v);
    setLoading(true);
    debounceHandleChange(v);
  };

  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    if (!value.trim().length) {
      if (menuOpened) setMenuOpened(false);
    } else {
      if (!menuOpened) setMenuOpened(true);
    }
  }, [value]);

  const input = (
    <TextInput
      value={value}
      onChange={(e) => handleChange(e.currentTarget.value)}
      variant="filled"
      aria-label="Search for anything"
      placeholder="Search for anything"
      onBlur={() => setMenuOpened(false)}
      rightSection={
        loading ? (
          <SpinnerApp props={{ size: ICON_SIZE - 4 }} />
        ) : !value.trim().length ? (
          <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        ) : (
          <Tooltip label={'Clear Search'}>
            <ActionIcon
              size={ICON_SIZE}
              variant="transparent"
              onClick={() => {
                setSearchValue('');
                props.setValue('');
              }}
            >
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )
      }
      styles={{
        input: {
          backgroundColor:
            'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
          fontWeight: 500,
        },
      }}
      {...restProps}
    />
  );

  return !props.options?.withMenu ? (
    input
  ) : (
    <MenuSearch
      props={{
        opened: menuOpened,
        setOpened: setMenuOpened,
        setSearchValue: setSearchValue,
      }}
    >
      {input}
    </MenuSearch>
  );
}
