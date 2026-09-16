'use client';

import {
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useStoreProduct, useStoreProductVariant } from '@repo/store';
import { OrderItemGet } from '@repo/types';
import { ImageDefault } from '../../image/default';

export function CardOrderItem({ props }: { props: OrderItemGet }) {
  const productVariants = useStoreProductVariant((s) => s.productVariants);
  const productVariant = productVariants?.find((pvi) => pvi.id == props.productVariantId);
  const products = useStoreProduct((s) => s.products);
  const product = products?.find((pi) => pi.id == productVariant?.productId);

  const divider = <Divider orientation="vertical" h={24} visibleFrom="xs" color="sec" />;

  return (
    <Card bg={'transparent'} px={0}>
      <Grid align="center">
        <GridCol span={{ base: 4, xs: 1.5 }}>
          <ImageDefault
            src={product?.image || 'loading'}
            alt={product?.title || 'loading'}
            height={80}
            fit={'contain'}
            radius={'lg'}
          />
        </GridCol>

        <GridCol span={{ base: 8, xs: 10.5 }}>
          <Flex gap={{ base: 'xl', xs: 'md' }} justify="space-between" wrap="nowrap"></Flex>

          <Stack gap={5}>
            <Group gap={'xs'} align="end" wrap="nowrap">
              <Title order={2} fz={'md'} fw={500} c={'sec'}>
                {product?.title}
              </Title>
            </Group>

            {product?.title.toLowerCase().trim() != productVariant?.title?.toLowerCase().trim() && (
              <Group gap={'xs'} align="end" wrap="nowrap">
                <Text fz={'sm'}>{productVariant?.title}</Text>
              </Group>
            )}

            <Flex
              fz={'sm'}
              direction={{ base: 'column', xs: 'row' }}
              align={{ base: 'start', xs: 'center' }}
              gap={'xs'}
            >
              <Group fz={'sm'} visibleFrom="xs">
                <Text inherit>
                  Unit Price:{' '}
                  <Text component="span" inherit c={'ter'} fw={500}>
                    <NumberFormatter value={productVariant?.price} />
                    /-
                  </Text>
                </Text>
              </Group>

              {divider}

              <Group fz={'sm'}>
                <Text inherit>
                  Qty:{' '}
                  <Text component="span" inherit c={'pri'} fw={500}>
                    <NumberFormatter value={props.quantity} />
                  </Text>
                </Text>
              </Group>

              {divider}

              <Group fz={'sm'}>
                <Text inherit>
                  Total:{' '}
                  <Text component="span" inherit c={'ter'} fw={500}>
                    <NumberFormatter value={(productVariant?.price || 0) * props.quantity} />
                    /-
                  </Text>
                </Text>
              </Group>
            </Flex>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
