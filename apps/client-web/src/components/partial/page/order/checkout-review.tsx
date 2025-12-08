'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import AsideOrder from '@/components/layout/asides/order';
import {
  Button,
  Card,
  CardSection,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import IntroSection from '@repo/components/layout/intros/section';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreOrderDetails } from '@/libraries/zustand/stores/order-details';
import CardMenuSummary from '@/components/common/cards/menu/summary';
import { defaultOrderDetails } from '@/data/orders';
import CardMenuMain from '@/components/common/cards/menu/main';
import { products } from '@/data/menu';
import { ProductType } from '@repo/types/models/enums';
import { useStoreVariant } from '@/libraries/zustand/stores/variant';

export default function CheckoutReview() {
  const { orderDetails } = useStoreOrderDetails();
  const { variants } = useStoreVariant();

  const getSum = () => {
    let sum = 0;

    orderDetails?.products.map((p) => {
      const variant = variants?.find((v) => v.id == p.selected_variant_id);
      if (variant?.price) sum += variant.price;
    });

    return sum;
  };

  const getVat = () => {
    let sum = getSum();
    sum = (30 / 100) * sum;
    return sum;
  };

  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <IntroSection
        props={{ title: 'Order Summary' }}
        options={{ alignment: 'start' }}
      />

      <Grid gutter={'xl'} mt={'xl'}>
        <GridCol span={{ base: 12, md: 8.5 }}>
          <Stack gap={'xl'}>
            <Group justify="end">
              <NextLink href="/order/select-menu">
                <Button>Add more items</Button>
              </NextLink>
            </Group>

            <Card bg={'var(--mantine-color-dark-7)'}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
                <Title order={3}>Review and Modify Your Items</Title>
              </CardSection>

              <ScrollArea w={'100%'} scrollbars={'x'} type="auto">
                <Stack mt={'md'} miw={900} pb={'lg'}>
                  {(orderDetails || defaultOrderDetails).products.map(
                    (pi, i) => (
                      <Stack gap={5} key={i}>
                        {i > 0 && <Divider mb={'xs'} />}

                        <CardMenuSummary props={pi} />
                      </Stack>
                    )
                  )}
                </Stack>
              </ScrollArea>
            </Card>

            <Card bg={'var(--mantine-color-dark-7)'}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
                <Title order={3}>Choose Your Sides</Title>
              </CardSection>

              <Grid mt={'md'}>
                {products
                  .filter((p) => p.type == ProductType.SIDE)
                  .map(
                    (pi, i) =>
                      i < 3 && (
                        <GridCol key={i} span={{ base: 12, md: 3 }}>
                          <CardMenuMain props={pi} options={{ small: true }} />
                        </GridCol>
                      )
                  )}
              </Grid>
            </Card>

            <Card bg={'var(--mantine-color-dark-7)'}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
                <Title order={3}>Choose Your Drinks</Title>
              </CardSection>

              <Grid mt={'md'}>
                {products
                  .filter((p) => p.type == ProductType.DRINK)
                  .map(
                    (pi, i) =>
                      i < 3 && (
                        <GridCol key={i} span={{ base: 12, md: 3 }}>
                          <CardMenuMain props={pi} options={{ small: true }} />
                        </GridCol>
                      )
                  )}
              </Grid>
            </Card>
          </Stack>

          <Group justify="end" mt={'xl'}>
            <Card
              bg={'var(--mantine-color-dark-7)'}
              w={{ base: '100%', md: '40%' }}
            >
              <Stack>
                <Group justify="space-between">
                  <Text>Food & Drink:</Text>

                  <Text fz={'sm'}>
                    Kes.{' '}
                    <Text component="span" inherit fz={'md'} fw={'bold'}>
                      <NumberFormatter value={getSum()} />
                    </Text>
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text>Taxes (VAT):</Text>

                  <Text fz={'sm'}>
                    Kes.{' '}
                    <Text component="span" inherit fz={'md'} fw={'bold'}>
                      <NumberFormatter value={getVat()} />
                    </Text>
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text>Total:</Text>

                  <Text fz={'sm'}>
                    Kes.{' '}
                    <Text component="span" inherit fz={'md'} fw={'bold'}>
                      <NumberFormatter value={getSum() + getVat()} />
                    </Text>
                  </Text>
                </Group>
              </Stack>
            </Card>
          </Group>
        </GridCol>

        <GridCol span={{ base: 12, md: 3.5 }}>
          <AsideOrder />
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}
