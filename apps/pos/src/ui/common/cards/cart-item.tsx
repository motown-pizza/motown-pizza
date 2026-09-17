'use client';

import React from 'react';
import { ActionIcon, Card, Group, NumberFormatter, Stack, Text, Title } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconTrash } from '@tabler/icons-react';
import { useStoreProductVariant } from '@repo/store';
import { useStoreProduct } from '@repo/store';
import { CartItemGet } from '@repo/types';
import { useCartItemActions } from '@repo/store';

export default function CartItem({ props }: { props: CartItemGet }) {
  const { cartItemDelete } = useCartItemActions();
  const { productVariants } = useStoreProductVariant();
  const productVariantCurrent = productVariants?.find((pv) => pv.id === props.productVariantId);
  const { products } = useStoreProduct();
  const productCurrent = products?.find((pi) => pi.id === productVariantCurrent?.productId);

  return (
    <Card bg={'var(--mantine-color-dark-8)'} padding={0} py={'sm'} px={'md'}>
      <Stack>
        <Group align="start" justify="space-between" wrap="nowrap">
          <div>
            <Title order={3} fz={'md'} fw={'bold'} lineClamp={1} c={'sec'}>
              {productCurrent?.title}
            </Title>

            <Text fz={'sm'} c={'dimmed'} lineClamp={1}>
              {productVariantCurrent?.title}
            </Text>
          </div>

          <Group align="end" ta={'end'}>
            <Text inherit fz={'sm'} fw={500}>
              x<NumberFormatter value={props.quantity} />
            </Text>
          </Group>
        </Group>

        <Group align="start" justify="space-between" wrap="nowrap">
          <Group justify="end">
            <ActionIcon size={ICON_WRAPPER_SIZE} color="pri" onClick={() => cartItemDelete(props)}>
              <IconTrash size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>

          <Group justify="end" ta={'end'}>
            <Text inherit>
              Kshs.{' '}
              <Text component="span" inherit fw={'bold'} c={'ter'} fz={'lg'}>
                <NumberFormatter value={(productVariantCurrent?.price || 0) * props.quantity} />
              </Text>
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
