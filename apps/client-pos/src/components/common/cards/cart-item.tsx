'use client';

import React from 'react';
import {
  ActionIcon,
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconTrash } from '@tabler/icons-react';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { CartItemGet } from '@repo/types/models/cart-item';
import { useCartItemActions } from '@repo/hooks/actions/cart-item';

export default function CartItem({ props }: { props: CartItemGet }) {
  const { cartItemDelete } = useCartItemActions();
  const { productVariants } = useStoreProductVariant();
  const productVariantCurrent = productVariants?.find(
    (pv) => pv.id === props.product_variant_id
  );
  const { products } = useStoreProduct();
  const productCurrent = products?.find(
    (pi) => pi.id === productVariantCurrent?.product_id
  );

  return (
    <Card bg={'var(--mantine-color-dark-8)'} padding={0} py={'sm'} px={'md'}>
      <Stack>
        <Group align="start" justify="space-between" wrap="nowrap">
          <div>
            <Title order={3} fz={'md'} fw={'bold'} lineClamp={1}>
              {productCurrent?.title}
            </Title>

            <Text fz={'sm'} c={'dimmed'} lineClamp={1}>
              {productVariantCurrent?.title}
            </Text>
          </div>

          <Group align="end" ta={'end'}>
            <Text inherit fz={'sm'} c={'dimmed'} fw={500}>
              x<NumberFormatter value={props.quantity} />
            </Text>
          </Group>
        </Group>

        <Group align="start" justify="space-between" wrap="nowrap">
          <Group justify="end">
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              color="dark"
              onClick={() => cartItemDelete(props)}
            >
              <IconTrash size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>

          <Group justify="end" ta={'end'}>
            <Text inherit>
              Kshs.{' '}
              <Text component="span" inherit fw={'bold'} c={'sec'} fz={'lg'}>
                <NumberFormatter
                  value={(productVariantCurrent?.price || 0) * props.quantity}
                />
              </Text>
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
