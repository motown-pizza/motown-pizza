import { Badge } from '@mantine/core';
import { ProductDietaryType } from '@repo/types/models/enums';
import { ProductGet } from '@repo/types/models/product';

export default function BadgeDietType({ props }: { props: ProductGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.dietary_class) {
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
      {props.dietary_class}
    </Badge>
  );
}
