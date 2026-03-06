import {
  Divider,
  Group,
  NumberFormatter,
  Pagination,
  Skeleton,
  Text,
} from '@mantine/core';
import React, { Dispatch, SetStateAction } from 'react';

export default function Footer({
  props,
}: {
  props: {
    list?: any[] | null;
    activePage: number;
    setActivePage: Dispatch<SetStateAction<number>>;
    totalPages: number;
    pageRange: any;
  };
}) {
  return (
    <div>
      <Divider />

      <Group justify="space-between" py={'md'} px={'xs'}>
        {props.list === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !props.pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={props.pageRange?.from} /> to{' '}
            <NumberFormatter value={props.pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {props.list === undefined ? (
            <>
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
            </>
          ) : !props.totalPages ? null : (
            <Pagination
              size={'sm'}
              total={props.totalPages}
              value={props.activePage}
              onChange={props.setActivePage}
            />
          )}
        </Group>
      </Group>
    </div>
  );
}
