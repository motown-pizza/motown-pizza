import { Badge } from '@mantine/core';
import { OrderFulfilmentType } from '@repo/types/models/enums';
import { OrderGet } from '@repo/types/models/order';
import { capitalizeWords } from '@repo/utilities/string';

export default function OrderType({ props }: { props: OrderGet }) {
  const badgeProps = {
    color: '',
    label: capitalizeWords(props.fulfillment_type),
  };

  switch (props.fulfillment_type) {
    case OrderFulfilmentType.COLLECTION:
      badgeProps.color = 'teal';
      break;
    case OrderFulfilmentType.DELIVERY:
      badgeProps.color = 'violet';
      break;
    case OrderFulfilmentType.DINE_IN:
      badgeProps.color = 'blue';
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
