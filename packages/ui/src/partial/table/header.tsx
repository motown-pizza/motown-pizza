'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Group, NumberFormatter, Skeleton, Stack, Text } from '@mantine/core';
import { InputTextSearch } from '../../input/text/search';
import { usePathname } from 'next/navigation';

export function PartialTableHeader({
  children,
  props,
}: {
  children: React.ReactNode;
  props: {
    list?: any[] | null;
    selectedRows: any[];
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    options?: { nested?: boolean };
  };
}) {
  const pathname = usePathname();

  return (
    <Stack py={'md'} px={'xs'}>
      <Group justify="space-between">
        <Group>
          <InputTextSearch
            props={{ value: props.search, setValue: props.setSearch }}
            aria-label="Search items"
            placeholder="Search items"
            w={320}
          />
        </Group>
      </Group>

      <Group justify="space-between" mih={30}>
        <Group>
          {props.list === undefined ? (
            <Skeleton h={20} w={120} />
          ) : (
            <Text fz={'lg'} fw={'bold'}>
              <Text component="span" inherit>
                {props.selectedRows.length ? 'Selected' : 'Total'}:{' '}
              </Text>

              <Text component="span" inherit>
                {props.selectedRows.length ? (
                  <NumberFormatter value={props.selectedRows.length} />
                ) : (
                  <NumberFormatter value={(props.list || []).length || 0} />
                )}
              </Text>
            </Text>
          )}
        </Group>

        <Group justify="end">{children}</Group>
      </Group>
    </Stack>
  );
}
