import { Badge } from '@mantine/core';
import { OrderStatus as EnumOrderStatus } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';
import { Status as EnumStatus } from '@repo/types/models/enums';

export default function Status({ props }: { props: { status: any } }) {
  const badgeProps = {
    color: '',
    label: capitalizeWords(props.status),
  };

  switch (props.status) {
    // default cases
    case EnumStatus.ACTIVE:
      badgeProps.color = 'green';
      break;
    case EnumStatus.DRAFT:
      badgeProps.color = 'blue';
      break;
    case EnumStatus.INACTIVE:
      badgeProps.color = 'yellow';
      break;

    // order cases
    case EnumOrderStatus.CANCELLED:
      badgeProps.color = 'red';
      break;
    case EnumOrderStatus.COMPLETED:
      badgeProps.color = 'green';
      break;
    case EnumOrderStatus.DRAFT:
      badgeProps.color = 'gray';
      break;
    case EnumOrderStatus.FINALIZED:
      badgeProps.color = 'lime';
      break;
    case EnumOrderStatus.OUT_FOR_DELIVERY:
      badgeProps.color = 'teal';
      break;
    case EnumOrderStatus.PREPARING:
      badgeProps.color = 'yellow';
      break;
    case EnumOrderStatus.PROCESSING:
      badgeProps.color = 'grape';
      break;
    case EnumOrderStatus.READY:
      badgeProps.color = 'cyan';
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
