import { Badge } from '@mantine/core';
import { ProductDietaryType } from '@repo/types';

export function TagBadge({
  type,
  label,
}: {
  type: 'bestseller' | 'spicy' | 'veg';
  label: string;
}) {
  const color =
    type === 'bestseller' ? 'yellow.6' : type === 'spicy' ? 'red.6' : 'green.6';

  return (
    <Badge
      size="sm"
      variant="filled"
      radius="sm"
      color={color}
      c={type === 'bestseller' ? 'black' : 'white'}
      style={{ textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}
    >
      {label}
    </Badge>
  );
}
