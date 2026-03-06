'use client';

import { Skeleton, TableTd, TableTr } from '@mantine/core';
import React from 'react';

type SkeletonRowProps<T extends Record<string, string>> = {
  widths: T;
  renderers?: Partial<Record<keyof T, React.ReactNode>>;
  defaultRenderer?: React.ReactNode;
};

export default function TableRow<T extends Record<string, string>>({
  widths,
  renderers = {},
  defaultRenderer = <Skeleton h={20} w="75%" />,
}: SkeletonRowProps<T>) {
  const columns = objectToColumns(widths);

  return (
    <TableTr h={59}>
      {columns.map(({ key, width }) => (
        <TableTd key={String(key)} w={width}>
          {renderers[key] ?? defaultRenderer}
        </TableTd>
      ))}
    </TableTr>
  );
}

function objectToColumns<T extends Record<string, string>>(obj: T) {
  return Object.entries(obj).map(([key, width]) => ({
    key: key as keyof T,
    width,
  }));
}
