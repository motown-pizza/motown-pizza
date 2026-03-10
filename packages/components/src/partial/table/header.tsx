import React, { Dispatch, SetStateAction } from 'react';
import {
  Button,
  Group,
  NumberFormatter,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import InputTextSearch from '../../common/inputs/text/search';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({
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
