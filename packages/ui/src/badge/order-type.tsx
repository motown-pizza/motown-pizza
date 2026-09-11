import { Badge } from '@mantine/core';
import { OrderFulfilmentType } from '@repo/types';
import { OrderGet } from '@repo/types';
import { capitalizeWords } from '@repo/utils';

export function BadgeOrderType({ props }: { props: OrderGet }) {
  const badgeProps = {
    color: '',
    label: capitalizeWords(props.fulfillmentType),
  };

  switch (props.fulfillmentType) {
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
