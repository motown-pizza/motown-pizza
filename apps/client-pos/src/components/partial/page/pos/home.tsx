'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  NumberFormatter,
  ScrollAreaAutosize,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import NextLink from '@repo/components/common/anchor/next-link';
import { getRegionalDate } from '@repo/utilities/date-time';
import CardOverview from '@/components/common/cards/overview';
import {
  IconCoin,
  IconMoodPuzzled,
  IconToolsKitchen,
} from '@tabler/icons-react';
import InputSearch from '@/components/common/inputs/search';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { OrderGet } from '@repo/types/models/order';
import { capitalizeWords } from '@repo/utilities/string';
import { ProductType } from '@repo/types/models/enums';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import ImageDefault from '@repo/components/common/images/default';
import { APP_SHELL } from '@/data/constants';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import BadgeOrderStatus from '../../../common/badges/order-status';
import { useTime } from '@repo/hooks/time';

export default function Home() {
  return (
    <Grid py={'md'}>
      <GridCol span={7}>
        <Stack gap={'xs'}>
          <CardGreeting />

          <Divider />

          <Grid gutter={'xs'}>
            <GridCol span={6}>
              <CardOverview
                props={{
                  title: 'Total Earnings',
                  icon: { icon: IconCoin, color: 'cyan' },
                  value: 10240,
                  analytics: {
                    change: 2.8,
                    changeType: 'up',
                    desc: 'from yesterday',
                  },
                }}
              />
            </GridCol>

            <GridCol span={6}>
              <CardOverview
                props={{
                  title: 'Orders In Progress',
                  icon: { icon: IconToolsKitchen, color: 'lime' },
                  value: 124,
                  analytics: {
                    change: 3.6,
                    changeType: 'down',
                    desc: 'from last week',
                  },
                }}
              />
            </GridCol>

            <GridCol span={12}>
              <CardRecentOrders />
            </GridCol>
          </Grid>
        </Stack>
      </GridCol>

      <GridCol span={5}>
        <CardPopularItems />
      </GridCol>
    </Grid>
  );
}

function CardGreeting() {
  const { now } = useTime();

  const regionalDate = getRegionalDate(now, {
    locale: 'en-GB',
    format: 'full',
  });

  return (
    <Card bg={'transparent'} padding={0} radius={0}>
      <Group justify="space-between">
        <div>
          <Title order={2}>Hello, John</Title>
          <Text c={'dimmed'}>Welcome back! Give them your best.</Text>
        </div>

        <div>
          <Title order={2} ta={'end'}>
            {regionalDate.time.toUpperCase()}
          </Title>
          <Text c={'dimmed'} ta={'end'}>
            {regionalDate.date}
          </Text>
        </div>
      </Group>
    </Card>
  );
}

function CardRecentOrders() {
  const { orders } = useStoreOrder();

  return (
    <Card bg={'var(--mantine-color-dark-9)'} padding={0}>
      <ScrollAreaAutosize
        h={`calc(100vh - ${APP_SHELL.HEADER_HEIGHT + APP_SHELL.FOOTER_HEIGHT}px - 280px)`}
        scrollbars={'y'}
      >
        <Stack gap={0} px={'md'}>
          <Box
            pos={'sticky'}
            top={0}
            style={{ zIndex: 1 }}
            bg={'var(--mantine-color-dark-9)'}
            pt={'md'}
          >
            <Group justify="space-between" align="end">
              <Title order={2} fz={'md'} fw={500} c={'sec'}>
                Recent Orders
              </Title>

              <Group justify="end" gap={'xs'}>
                <InputSearch
                  w={{ md: 200 }}
                  size="xs"
                  variant="filled"
                  styles={{
                    input: { backgroundColor: 'var(--mantine-color-dark-7)' },
                  }}
                />

                <NextLink href="/pos/orders">
                  <Button size="xs" variant="light">
                    All Orders
                  </Button>
                </NextLink>
              </Group>
            </Group>

            <Divider mt={'xs'} />
          </Box>

          <Stack gap={0}>
            {orders === undefined ? (
              <Stack align="center" py={SECTION_SPACING * 2}>
                <Loader />
                <Text inherit fz={'sm'} c={'dimmed'}>
                  Fetching recent orders
                </Text>
              </Stack>
            ) : !orders?.length ? (
              <Stack
                align="center"
                py={SECTION_SPACING * 2}
                fz={'sm'}
                c={'dimmed'}
                ta={'center'}
              >
                <ThemeIcon
                  size={ICON_WRAPPER_SIZE * 2}
                  variant="light"
                  radius={99}
                >
                  <IconMoodPuzzled
                    size={ICON_SIZE * 1.5}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ThemeIcon>

                <Stack align="center" ta={'center'} gap={0}>
                  <Text inherit maw={280}>
                    No recent orders.
                  </Text>

                  <Text inherit maw={320} mt={'xs'}>
                    Placed orders will appear here automatically.
                  </Text>
                </Stack>
              </Stack>
            ) : (
              orders
                .concat(orders.concat(orders.concat(orders)))
                .map((oi, i) => (
                  <div key={i}>
                    {i > 0 && <Divider />}
                    <CardOrderRecent props={oi} />
                  </div>
                ))
            )}
          </Stack>
        </Stack>
      </ScrollAreaAutosize>
    </Card>
  );
}

function CardOrderRecent({ props }: { props: OrderGet }) {
  return (
    <Card bg={'transparent'} padding={0} px={0} py={5}>
      <Group justify="space-between">
        <Group gap={'xs'}>
          <div>
            <Avatar
              key={props.customer_name}
              name={props.customer_name}
              color="initials"
            />
          </div>

          <div>
            <Text inherit>{capitalizeWords(props.customer_name)}</Text>
            <Text inherit c={'dimmed'} fz={'sm'}>
              {props.customer_phone}
            </Text>
          </div>
        </Group>

        <Group justify="end">
          <BadgeOrderStatus props={props} />
        </Group>
      </Group>
    </Card>
  );
}

function CardPopularItems() {
  const { products } = useStoreProduct();
  const { productVariants } = useStoreProductVariant();

  const pizzaVariants = productVariants?.filter((pv) => {
    const pizzaIds = products
      ?.filter((p) => p.type == ProductType.PIZZA)
      .map((p) => p.id);

    return pizzaIds?.includes(pv.product_id);
  });

  const dedupedPizzaVariants = Array.from(
    new Map(pizzaVariants?.map((i) => [i.product_id, i])).values()
  );

  return (
    <Card bg={'var(--mantine-color-dark-9)'} padding={0}>
      <ScrollAreaAutosize
        h={`calc(100vh - ${APP_SHELL.HEADER_HEIGHT + APP_SHELL.FOOTER_HEIGHT}px - 32px)`}
        scrollbars={'y'}
      >
        <Stack gap={0} px={'md'}>
          <Box
            pos={'sticky'}
            top={0}
            style={{ zIndex: 1 }}
            bg={'var(--mantine-color-dark-9)'}
            pt={'md'}
          >
            <Group justify="space-between" align="end">
              <Title order={2} fz={'md'} fw={500} c={'sec'}>
                Popular Items
              </Title>

              <Group justify="end">
                <NextLink href="/pos/menu">
                  <Button size="xs" variant="light">
                    All Items
                  </Button>
                </NextLink>
              </Group>
            </Group>

            <Divider mt={'xs'} />
          </Box>

          <Stack gap={0}>
            {productVariants === undefined ? (
              <Stack align="center" py={SECTION_SPACING * 2}>
                <Loader />
                <Text inherit fz={'sm'} c={'dimmed'}>
                  Fetching popular items
                </Text>
              </Stack>
            ) : !dedupedPizzaVariants.length ? (
              <Stack
                align="center"
                py={SECTION_SPACING * 2}
                fz={'sm'}
                c={'dimmed'}
                ta={'center'}
              >
                <ThemeIcon
                  size={ICON_WRAPPER_SIZE * 2}
                  variant="light"
                  radius={99}
                >
                  <IconMoodPuzzled
                    size={ICON_SIZE * 1.5}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ThemeIcon>

                <Stack align="center" ta={'center'} gap={0}>
                  <Text inherit maw={280}>
                    No popular items.
                  </Text>

                  <Text inherit maw={280} mt={'xs'}>
                    Items will appear here automatically when orders are placed.
                  </Text>
                </Stack>
              </Stack>
            ) : (
              dedupedPizzaVariants.map(
                (pvi, i) =>
                  i < 10 && (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <CardPopularItem props={pvi} />
                    </div>
                  )
              )
            )}
          </Stack>
        </Stack>
      </ScrollAreaAutosize>
    </Card>
  );
}

function CardPopularItem({ props }: { props: ProductVariantGet }) {
  const { products } = useStoreProduct();
  const { productVariants } = useStoreProductVariant();
  const { recipieItems } = useStoreRecipieItem();
  const { ingredients } = useStoreIngredient();
  const { orderItems } = useStoreOrderItem();

  const product = products?.find((p) => p.id == props.product_id);

  const productRecipieItems = recipieItems?.filter(
    (ri) => ri.product_variant_id == props.id
  );

  const productIngredients = ingredients?.filter((i) =>
    productRecipieItems?.map((ri) => ri.ingredient_id).includes(i.id)
  );

  const content = `${productIngredients?.map((i) => i.name).join(', ') ?? ''}`;

  const timesOrdered = orderItems?.filter((oi) => {
    const productVariantsCurrent = productVariants
      ?.filter((pvi) => pvi.product_id == product?.id)
      .map((pvi2) => pvi2.id);

    return productVariantsCurrent?.includes(oi.product_variant_id);
  }).length;

  return (
    <Card bg={'transparent'} padding={0} py={'xs'}>
      <Grid gutter={0} align="center">
        <GridCol span={{ base: 2, lg: 1.5 }}>
          {!product?.image ? (
            <div></div>
          ) : (
            <ImageDefault
              src={product?.image}
              alt={product.title}
              height={56}
              width={56}
              mode="grid"
            />
          )}
        </GridCol>

        <GridCol span={{ base: 10, lg: 10.5 }}>
          <div>
            <Title order={3} fz={'md'} fw={500}>
              {product?.title}
            </Title>
            <Text inherit c={'dimmed'} fz={'sm'} lineClamp={1}>
              {content} {content}
            </Text>

            {!timesOrdered
              ? null
              : timesOrdered > 0 && (
                  <Text inherit fz={'xs'} mt={5}>
                    Ordered:{' '}
                    <Text component="span" inherit fw={500} c={'blue'}>
                      <NumberFormatter value={timesOrdered} />
                    </Text>{' '}
                    times
                  </Text>
                )}
          </div>
        </GridCol>
      </Grid>
    </Card>
  );
}
