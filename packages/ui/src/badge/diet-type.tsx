import { Badge } from '@mantine/core';
import { ProductDietaryType } from '@repo/types';
import { ProductGet } from '@repo/types';

export function BadgeDietType({ props }: { props: ProductGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.dietaryClass) {
    case ProductDietaryType.MEATY:
      badgeProps.color = 'orange';
      break;
    case ProductDietaryType.VEGGIE:
      badgeProps.color = 'lime';
      break;
    case ProductDietaryType.VEGAN:
      badgeProps.color = 'pink';
      break;
    case ProductDietaryType.NEUTRAL:
      badgeProps.color = 'blue';
      break;

    default:
      break;
  }

  return (
    <Badge variant="light" color={`${badgeProps.color}.6`}>
      {props.dietaryClass}
    </Badge>
  );
}
