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
  };
}) {
  return (
    <Stack py={'md'} px={'xs'}>
      <Group justify="space-between">
        <InputTextSearch
          props={{ value: props.search, setValue: props.setSearch }}
          aria-label="Search items"
          placeholder="Search items"
          w={320}
        />

        <Button
          size="xs"
          leftSection={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
        >
          Add New
        </Button>
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

        <Group justify="end">
          {props.selectedRows.length == 1 && (
            <Button
              size="xs"
              color="blue"
              leftSection={
                <IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Edit Item
            </Button>
          )}

          {children}
        </Group>
      </Group>
    </Stack>
  );
}
