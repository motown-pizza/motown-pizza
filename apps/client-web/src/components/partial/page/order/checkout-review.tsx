'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import AsideOrder from '@/components/layout/asides/order';
import {
  Button,
  Card,
  CardSection,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import IntroSection from '@repo/components/layout/intros/section';
import NextLink from '@repo/components/common/anchor/next-link';
import CardMenuMain from '@/components/common/cards/menu/main';
import { ProductType } from '@repo/types/models/enums';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import CardMenuCart from '@/components/common/cards/menu/cart';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';

export default function CheckoutReview() {
  const { products } = useStoreProduct();
  const { cartItems } = useStoreCartItem();

  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <IntroSection
        props={{ title: 'Order Summary' }}
        options={{ alignment: 'start' }}
      />

      <Grid gutter={'xl'} mt={'xl'}>
        <GridCol span={{ base: 12, md: 8.5 }}>
          <Stack gap={'xl'}>
            <Card bg={'var(--mantine-color-dark-7)'} padding={0}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
                <Group justify="space-between">
                  <Title order={3}>Review and Modify Your Items</Title>

                  <NextLink href="/order/select-menu">
                    <Button
                      leftSection={
                        <IconArrowLeft
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      }
                    >
                      Add more items
                    </Button>
                  </NextLink>
                </Group>
              </CardSection>

              <ScrollArea scrollbars={'y'} h={400}>
                {cartItems === undefined ? (
                  <Center py={SECTION_SPACING * 2}>
                    <Loader />
                  </Center>
                ) : !cartItems?.length ? (
                  <Stack align="center" py={SECTION_SPACING * 2}>
                    <Text>No order items selected.</Text>

                    <NextLink href="/order/select-menu?menuTab=pizzas">
                      <Group justify="center">
                        <Button>Select items to order</Button>
                      </Group>
                    </NextLink>
                  </Stack>
                ) : (
                  cartItems?.map((ci, i) => (
                    <Stack gap={5} key={i} pr={'xs'}>
                      {i > 0 && <Divider mb={'xs'} />}

                      <CardMenuCart props={ci} options={{ checkout: true }} />
                    </Stack>
                  ))
                )}
              </ScrollArea>

              {/* <Stack mt={'md'}>
                {cartItems?.map((ci, i) => (
                  <Stack gap={5} key={i}>
                    {i > 0 && <Divider mb={'xs'} />}

                    <CardMenuCart props={ci} options={{ checkout: true }} />
                  </Stack>
                ))}
              </Stack> */}
            </Card>

            <Card bg={'var(--mantine-color-dark-7)'}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
                <Title order={3}>Choose Your Sides</Title>
              </CardSection>

              <Grid mt={'md'}>
                {products
                  ?.filter((p) => p.type == ProductType.SIDE)
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
                  ?.filter((p) => p.type == ProductType.DRINK)
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
        </GridCol>

        <GridCol span={{ base: 12, md: 3.5 }}>
          <AsideOrder />
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}
