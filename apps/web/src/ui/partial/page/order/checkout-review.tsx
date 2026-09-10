'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import AsideOrder from '@web/ui/layout/asides/order';
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
import { LayoutIntroSection } from '@repo/ui';
import { AnchorNextLink } from '@repo/ui';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { useStoreCartItem } from '@repo/store';
import CardMenuCart from '@web/ui/common/cards/menu/cart';
import { IconArrowLeft } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, SECTION_SPACING } from '@repo/constants';

export default function CheckoutReview() {
  const { products } = useStoreProduct();
  const { cartItems } = useStoreCartItem();

  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <LayoutIntroSection props={{ title: 'Order Summary' }} options={{ alignment: 'start' }} />

      <Grid gap={'xl'} mt={'xl'}>
        <GridCol span={{ base: 12, md: 8 }}>
          <Stack gap={'xl'}>
            <Card bg={'var(--mantine-color-dark-8)'} padding={0}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-7)'}>
                <Group justify="space-between">
                  <Title order={3}>Review and Modify Your Items</Title>

                  <AnchorNextLink href="/order/select-menu">
                    <Button
                      leftSection={<IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    >
                      Add more items
                    </Button>
                  </AnchorNextLink>
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

                    <AnchorNextLink href="/order/select-menu?menuTab=pizzas">
                      <Group justify="center">
                        <Button>Select items to order</Button>
                      </Group>
                    </AnchorNextLink>
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

            <Card bg={'var(--mantine-color-dark-8)'}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-7)'}>
                <Title order={3}>Choose Your Sides</Title>
              </CardSection>

              <Grid mt={'md'}>
                {products
                  ?.filter((p) => p.type == ProductType.SIDE)
                  .map(
                    (pi, i) =>
                      i < 6 && (
                        <GridCol key={i} span={{ base: 12, md: 6, xl: 4 }}>
                          <CardMenuMain props={pi} options={{ small: true }} />
                        </GridCol>
                      ),
                  )}
              </Grid>
            </Card>

            <Card bg={'var(--mantine-color-dark-8)'}>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-7)'}>
                <Title order={3}>Choose Your Drinks</Title>
              </CardSection>

              <Grid mt={'md'}>
                {products
                  ?.filter((p) => p.type == ProductType.DRINK)
                  .map(
                    (pi, i) =>
                      i < 6 && (
                        <GridCol key={i} span={{ base: 12, md: 6, xl: 4 }}>
                          <CardMenuMain props={pi} options={{ small: true }} />
                        </GridCol>
                      ),
                  )}
              </Grid>
            </Card>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          <AsideOrder />
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}
