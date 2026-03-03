import { useTableStatus } from '@/hooks/table';
import { Badge } from '@mantine/core';
import { TableStatus as EnumTableStatus } from '@repo/types/models/enums';
import { TableGet } from '@repo/types/models/table';
import { capitalizeWords } from '@repo/utilities/string';
import { useEffect, useState } from 'react';

export default function TableStatus({ props }: { props: TableGet }) {
  const [badgeProps, setBadgeProps] = useState({
    color: 'green.6',
    label: capitalizeWords(EnumTableStatus.AVAILABLE),
  });

  const { isBooked, isOccupied } = useTableStatus({ table: props });

  useEffect(() => {
    if (isOccupied) {
      setBadgeProps({
        ...badgeProps,
        color: 'yellow.6',
        label: capitalizeWords(EnumTableStatus.OCCUPIED),
      });
    } else if (isBooked) {
      setBadgeProps({
        ...badgeProps,
        color: 'blue.6',
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
