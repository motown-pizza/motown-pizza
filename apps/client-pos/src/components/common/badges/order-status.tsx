import { Badge } from '@mantine/core';
import { OrderStatus as EnumOrderStatus } from '@repo/types/models/enums';
import { OrderGet } from '@repo/types/models/order';
import { capitalizeWords } from '@repo/utilities/string';

export default function OrderStatus({ props }: { props: OrderGet }) {
  const badgeProps = {
    color: '',
    label: capitalizeWords(props.order_status),
  };

  switch (props.order_status) {
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
