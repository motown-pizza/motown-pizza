'use client';

import { useTableStatus } from '@repo/hooks';
import { Badge } from '@mantine/core';
import { TableStatus as EnumTableStatus } from '@repo/types';
import { TableGet } from '@repo/types';
import { capitalizeWords } from '@repo/utils';
import { useEffect, useState } from 'react';

export function BadgeTableStatus({ props }: { props: TableGet }) {
  const [badgeProps, setBadgeProps] = useState({
    color: 'green',
    label: capitalizeWords(EnumTableStatus.AVAILABLE),
  });

  const { isBooked, isOccupied } = useTableStatus({ table: props });

  useEffect(() => {
    if (isOccupied) {
      setBadgeProps({
        ...badgeProps,
        color: 'yellow',
        label: capitalizeWords(EnumTableStatus.OCCUPIED),
      });
    } else if (isBooked) {
      setBadgeProps({
        ...badgeProps,
        color: 'blue',
        label: capitalizeWords(EnumTableStatus.BOOKED),
      });
    }
  }, []);

  return (
    <Badge color={`${badgeProps.color}`} variant="light">
      {badgeProps.label}
    </Badge>
  );
}
