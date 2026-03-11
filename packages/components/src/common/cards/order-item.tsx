import React from 'react';
import {
  ActionIcon,
  Card,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import ImageDefault from '@repo/components/common/images/default';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { useCartItemActions } from '@repo/hooks/actions/cart-item';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';
import { OrderItemGet } from '@repo/types/models/order-item';

export default function OrderItem({
  props,
  options,
}: {
  props: OrderItemGet;
  options?: { checkout?: boolean };
}) {
  const { products } = useStoreProduct();
  const { productVariants } = useStoreProductVariant();

  const variant = (productVariants || []).find(
    (pv) => pv.id == props.product_variant_id
  );

  const product = (products || []).find((p) => p.id == variant?.product_id);

  return (
    <Card bg={'var(--mantine-color-body)'} pl={'xs'}>
      <Grid gutter={0}>
        <GridCol span={1.5}>
          <ImageDefault
            src={product?.image || ''}
            alt={product?.title || ''}
            height={80}
            fit={'contain'}
            radius={'lg'}
          />
        </GridCol>

        <GridCol span={10.5} pl={'xs'}>
          <Group justify="space-between">
            <Title order={3} fz={'md'} fw={500} c={'blue.6'} lineClamp={1}>
              {product?.title}
            </Title>
          </Group>

          {variant && (
            <>
              <Text inherit fz={'sm'}>
                {capitalizeWords(variant.size)}
              </Text>

              <Group justify="space-between" mt={'xs'}>
                <Group>
                  <Text inherit fz={'xs'} c={'dimmed'}>
                    Qty:{' '}
                    <Text component={'span'} inherit fw={500} c={'ter'}>
                      <NumberFormatter value={props.quantity} />
                    </Text>
                  </Text>
                </Group>

                <Text inherit fz={'sm'}>
                  Kshs.{' '}
                  <Text component="span" inherit fz={'md'} fw={500} c={'sec'}>
                    <NumberFormatter
                      value={(props.price_at_sale || 0) * props.quantity}
                    />
                  </Text>
                </Text>
              </Group>
            </>
          )}
        </GridCol>
      </Grid>
    </Card>
  );
}
