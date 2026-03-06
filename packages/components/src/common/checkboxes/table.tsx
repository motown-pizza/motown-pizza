'use client';

import { Checkbox, Group, Skeleton, Tooltip } from '@mantine/core';
import React from 'react';

export default function Table({
  props,
}: {
  props: {
    list?: any[] | null;
    setSelectedRows: any;
    rows?: any[];
    selectedRows: any[];
    options?: { head: boolean; itemId: string };
  };
}) {
  return (
    <Group>
      {props.list === undefined ? (
        <Skeleton h={20} w={20} />
      ) : props.options?.head ? (
        <Checkbox
          aria-label={`Select item`}
          checked={props.selectedRows.includes(props.options.itemId)}
          onChange={(event) =>
            props.setSelectedRows(
              event.currentTarget.checked
                ? [...props.selectedRows, props.options?.itemId]
                : props.selectedRows.filter(
                    (item) => item !== props.options?.itemId
                  )
            )
          }
        />
      ) : (
        <Tooltip label={`Select/Deselect all`}>
          <Checkbox
            aria-label={`Select all`}
            checked={
              (props.rows || []).length > 0 &&
              props.selectedRows.length == props.list?.length
            }
            onChange={(event) =>
              props.setSelectedRows(
                event.currentTarget.checked
                  ? (props.list || []).map((p) => p.id)
                  : []
              )
            }
          />
        </Tooltip>
      )}
    </Group>
  );
}
