import React from 'react';
import { Card, Grid, GridCol, Group, NumberFormatter, Text, Title } from '@mantine/core';
import { ImageDefault } from '../image/default';
import { useStoreProductVariant } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { useStoreProduct } from '@repo/store';
import { OrderItemGet } from '@repo/types';

export function CardOrderItem({
  props,
  options,
}: {
  props: OrderItemGet;
  options?: { checkout?: boolean };
}) {
  const { products } = useStoreProduct();
  const { productVariants } = useStoreProductVariant();

  const variant = (productVariants || []).find((pv) => pv.id == props.productVariantId);

  const product = (products || []).find((p) => p.id == variant?.productId);

  return (
    <Card bg={'var(--mantine-color-body)'} pl={'xs'}>
      <Grid gap={0}>
        <GridCol span={1.5}>
          <ImageDefault
            src={product?.image || 'loading'}
            alt={product?.title || 'loading'}
            height={80}
            fit={'contain'}
            radius={'lg'}
          />
        </GridCol>

        <GridCol span={10.5} pl={'xs'}>
          <Group justify="space-between">
            <Title order={3} fz={'md'} fw={500} c={'blue'} lineClamp={1}>
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
                    <NumberFormatter value={(props.priceAtSale || 0) * props.quantity} />
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
