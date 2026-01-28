import { Badge } from '@mantine/core';
import { TableStatus as EnumTableStatus } from '@repo/types/models/enums';
import { TableGet } from '@repo/types/models/table';
import { capitalizeWords } from '@repo/utilities/string';

export default function TableStatus({ props }: { props: TableGet }) {
  const badgeProps = {
    color: '',
    label: capitalizeWords(props.table_status),
  };

  switch (props.table_status) {
    case EnumTableStatus.AVAILABLE:
      badgeProps.color = 'green';
      break;
    case EnumTableStatus.BOOKED:
      badgeProps.color = 'blue';
      break;
    case EnumTableStatus.OCCUPIED:
      badgeProps.color = 'yellow';
      break;

    default:
      break;
  }

  return (
    <Badge color={`${badgeProps.color}`} variant="light">
      {badgeProps.label}
    </Badge>
  );
}
