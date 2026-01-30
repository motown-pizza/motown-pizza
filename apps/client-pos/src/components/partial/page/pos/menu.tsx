'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  CardSection,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  NumberFormatter,
  ScrollAreaAutosize,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { capitalizeWords } from '@repo/utilities/string';
import {
  OrderFulfilmentType,
  OrderStatus,
  ProductType,
} from '@repo/types/models/enums';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import {
  IconArrowLeft,
  IconBeer,
  IconCash,
  IconCookie,
  IconCreditCard,
  IconMeat,
  IconMoodPuzzled,
  IconPizza,
  IconPlus,
  IconSalad,
  IconSoup,
  IconTrash,
} from '@tabler/icons-react';
import NextLink from '@repo/components/common/anchor/next-link';
import { APP_SHELL } from '@/data/constants';
import CardMenuItem from '@/components/common/cards/menu-item';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { getRegionalDate } from '@repo/utilities/date-time';
import CardCartItem from '../../../common/cards/cart-item';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useOrderPlacementData } from '@/hooks/order';
import { useStoreTable } from '@repo/libraries/zustand/stores/table';
import { useStoreTableBooking } from '@repo/libraries/zustand/stores/table-booking';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useOrderActions } from '@repo/hooks/actions/order';
import { useRouter } from 'next/navigation';
import { PARAM_NAME } from '@repo/constants/names';
import { defaultOrderDetails } from '@/data/orders';

export default function Menu() {
  const { orderDetails } = useOrderPlacementData();
  const { tableBookings } = useStoreTableBooking();
  const tableBookingCurrent = tableBookings?.find(
    (tbi) => tbi.id == orderDetails?.table_booking_id
  );
  const { tables } = useStoreTable();
  const tableCurrent = tables?.find(
    (ti) => ti.id == tableBookingCurrent?.table_id
  );

  return (
    <>
      <Grid gutter={0}>
        <GridCol span={9}>
          <Group
            align="start"
            justify="space-between"
            pos={'sticky'}
            top={0}
            py={'lg'}
            pr={'lg'}
            style={{
              backgroundColor: 'var(--mantine-color-dark-8)',
              zIndex: 2,
            }}
          >
            <Group>
              <NextLink href={'/pos'}>
                <Group>
                  <ActionIcon size={ICON_WRAPPER_SIZE}>
                    <IconArrowLeft
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Group>
              </NextLink>

              <Title order={2}>Orders</Title>
            </Group>

            <Card padding={0} bg={'transparent'} radius={0}>
              <Group justify="space-between" gap={'xs'}>
                <Avatar
                  key={
                    !orderDetails ? 'Customer Name' : orderDetails.customer_name
                  }
                  name={
                    !orderDetails ? 'Customer Name' : orderDetails.customer_name
                  }
                  color="initials"
                />

                <Stack gap={0} justify="center" mih={43.3}>
                  <Title order={2} fz={'md'} fw={'bold'} miw={160}>
                    {!orderDetails
                      ? 'Customer Name'
                      : orderDetails.customer_name}
                  </Title>

                  <Text inherit fz={'sm'} c={'dimmed'}>
                    {!orderDetails
                      ? 'Fulfilment type'
                      : orderDetails.fulfillment_type ==
                          OrderFulfilmentType.DINE_IN
                        ? `Table No: ${tableCurrent?.table_number}`
                        : `Fulfilment: ${capitalizeWords(orderDetails.fulfillment_type)}`}
                  </Text>
                </Stack>
              </Group>
            </Card>
          </Group>

          <Box pr={'lg'} pb={'lg'}>
            <TabsMenu />
          </Box>
        </GridCol>

        <GridCol span={3}>
          <Box pos={'sticky'} top={0} pt={'lg'}>
            <CardOrderDetails />
          </Box>
        </GridCol>
      </Grid>
    </>
  );
}

function CardOrderDetails() {
  const router = useRouter();

  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderUpdate, orderDelete } = useOrderActions();
  const { cartItems, setCartItems } = useStoreCartItem();
  const { productVariants } = useStoreProductVariant();

  const getSum = () => {
    let total = 0;

    cartItems?.map((ci) => {
      const productVariant = productVariants?.find(
        (pv) => pv.id == ci.product_variant_id
      );

      if (!productVariant) return;

      total += productVariant.price * ci.quantity;
    });

    return total;
  };

  const sum = getSum();

  const [loadingPlace, setLoadingPlace] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleCancelOrder = () => {
    if (orderDetails === undefined) return;
    if (orderDetails === null) return;

    setLoadingCancel(true);
    orderDelete(orderDetails);
    setCartItems([]);
    setOrderDetails(defaultOrderDetails);

    router.push(`/pos`);
  };

  const handlePlaceOrder = () => {
    if (orderDetails === undefined) return;
    if (orderDetails === null) return;

    setLoadingPlace(true);
    orderUpdate(
      { ...orderDetails, order_status: OrderStatus.PREPARING },
      { placement: true }
    );
    setOrderDetails(defaultOrderDetails);

    router.push(
      `/pos/order-confirmed?${PARAM_NAME.ORDER_CONFIRMED}=${orderDetails.id}`
    );
  };

  return (
    <Card bg={'var(--mantine-color-dark-9)'} padding={0}>
      <CardSection
        pos={'sticky'}
        top={0}
        style={{ zIndex: 1 }}
        bg={'var(--mantine-color-dark-9)'}
        pt={'md'}
        px={'md'}
      >
        <Group justify="space-between" align="start">
          <Stack gap={0} mih={40.2} justify="space-between">
            <Title order={2} fz={'md'} fw={500}>
              {!orderDetails ? 'Customer Name' : orderDetails.tracking_code}
            </Title>

            <Text inherit c={'dimmed'} fz={'xs'}>
              {
                getRegionalDate(
                  !orderDetails ? new Date() : orderDetails.created_at,
                  {
                    locale: 'en-GB',
                    format: 'long',
                  }
                ).date
              }
            </Text>
          </Stack>

          <Group justify="end" gap={'xs'}>
            <Avatar
              key={!orderDetails ? 'Customer Name' : orderDetails.customer_name}
              name={
                !orderDetails ? 'Customer Name' : orderDetails.customer_name
              }
              color="initials"
            />
          </Group>
        </Group>
      </CardSection>

      <Divider mt={'md'} />

      <CardSection>
        <ScrollAreaAutosize
          h={`calc(100vh - ${APP_SHELL.HEADER_HEIGHT + APP_SHELL.FOOTER_HEIGHT}px - 273px)`}
          scrollbars={'y'}
        >
          <Stack gap={'xs'} px={'md'} pb={'md'}>
            <Box
              pos={'sticky'}
              top={0}
              bg={'var(--mantine-color-dark-9)'}
              style={{ zIndex: 1 }}
              pt={'md'}
              pb={'xs'}
            >
              <Title order={3} fz={'md'}>
                Order Details
              </Title>
            </Box>

            {cartItems === undefined ? (
              <Stack align="center" py={SECTION_SPACING}>
                <Loader />
                <Text inherit fz={'sm'} c={'dimmed'}>
                  Fetching cart items
                </Text>
              </Stack>
            ) : !cartItems?.length ? (
              <Stack
                align="center"
                py={SECTION_SPACING}
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
                    No cart items added yet.
                  </Text>

                  <Text inherit maw={320} mt={'xs'}>
                    Selected menu items will appear here automatically.
                  </Text>
                </Stack>
              </Stack>
            ) : (
              cartItems.map((ci, i) => (
                <div key={i}>
                  <CardCartItem props={ci} />
                </div>
              ))
            )}
          </Stack>
        </ScrollAreaAutosize>
      </CardSection>

      <Divider mb={'md'} />

      <CardSection px={'md'} pb={'md'}>
        <Stack>
          <Group justify="space-between" fz={'sm'} mih={27.9}>
            {cartItems === undefined ? (
              <Skeleton h={16} w={80} />
            ) : !cartItems?.length ? null : (
              <Text inherit>
                Items (<NumberFormatter value={cartItems?.length} />)
              </Text>
            )}

            {cartItems === undefined ? (
              <Skeleton h={16} w={100} />
            ) : !cartItems?.length ? null : (
              <Group justify="end" ta={'end'}>
                <Text inherit>
                  Kshs.{' '}
                  <Text
                    component="span"
                    inherit
                    fw={'bold'}
                    fz={'lg'}
                    c={'sec'}
                  >
                    <NumberFormatter value={sum} />
                  </Text>
                </Text>
              </Group>
            )}
          </Group>

          <Group gap={'xs'} grow>
            {cartItems === undefined ? (
              <Skeleton h={36} />
            ) : (
              <Button
                disabled={!cartItems?.length}
                color="dark"
                leftSection={
                  <IconCash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                Cash
              </Button>
            )}

            {cartItems === undefined ? (
              <Skeleton h={36} />
            ) : (
              <Button
                disabled={!cartItems?.length}
                color="dark"
                leftSection={
                  <IconCreditCard size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                Online
              </Button>
            )}
          </Group>

          <Group gap={'xs'} grow>
            {cartItems === undefined ? (
              <Skeleton h={36} />
            ) : (
              <Button
                disabled={!cartItems?.length}
                leftSection={
                  <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                color="pri.6"
                loading={loadingCancel}
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            )}

            {cartItems === undefined ? (
              <Skeleton h={36} />
            ) : (
              <Button
                disabled={!cartItems?.length}
                leftSection={
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                color="ter"
                c={
                  !cartItems?.length ? undefined : 'var(--mantine-color-black)'
                }
                loading={loadingPlace}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            )}
          </Group>
        </Stack>
      </CardSection>
    </Card>
  );
}

function CardMenuItemGroup({
  props,
}: {
  props: {
    type: ProductType;
  };
}) {
  const cardProps = { bg: '', c: '', icon: IconPizza, type: '' };

  switch (props.type) {
    case ProductType.PIZZA:
      cardProps.bg = 'violet';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconPizza;
      cardProps.type = ProductType.PIZZA;
      break;
    case ProductType.DRINK:
      cardProps.bg = 'indigo';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconBeer;
      cardProps.type = ProductType.DRINK;
      break;
    case ProductType.SIDE:
      cardProps.bg = 'pink';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconMeat;
      cardProps.type = ProductType.SIDE;
      break;
    case ProductType.SOUP:
      cardProps.bg = 'orange';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconSoup;
      cardProps.type = ProductType.SOUP;
      break;
    case ProductType.DESSERT:
      cardProps.bg = 'red';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconCookie;
      cardProps.type = ProductType.DESSERT;
      break;
    case ProductType.SALAD:
      cardProps.bg = 'green';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconSalad;
      cardProps.type = ProductType.SALAD;
      break;

    default:
      break;
  }

  return (
    <Card
      bg={`${cardProps.bg}.7`}
      c={cardProps.c}
      style={{ cursor: 'pointer' }}
    >
      <Stack gap={'lg'} ta={'start'}>
        <Group gap={5}>
          <cardProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

          <Title order={3} c={cardProps.c} fz={'lg'}>
            {capitalizeWords(props.type)}s
          </Title>
        </Group>

        <Text inherit fz={'sm'}>
          <NumberFormatter value={'4'} /> items
        </Text>
      </Stack>
    </Card>
  );
}

function TabsMenu() {
  const [activeTab, setActiveTab] = useState<ProductType>(ProductType.PIZZA);
  const { products } = useStoreProduct();
  const productsCurrent = products?.filter((pi) => pi.type == activeTab);

  const filteredItems =
    products === undefined ? (
      <Stack align="center" py={SECTION_SPACING * 2}>
        <Loader />
        <Text inherit fz={'sm'} c={'dimmed'}>
          Fetching menu items
        </Text>
      </Stack>
    ) : !products?.length ? (
      <Stack
        align="center"
        py={SECTION_SPACING * 2}
        fz={'sm'}
        c={'dimmed'}
        ta={'center'}
      >
        <ThemeIcon size={ICON_WRAPPER_SIZE * 2} variant="light" radius={99}>
          <IconMoodPuzzled size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>

        <Stack align="center" ta={'center'} gap={0}>
          <Text inherit maw={280}>
            No menu items found.
          </Text>
        </Stack>
      </Stack>
    ) : !productsCurrent?.length ? (
      <Stack
        align="center"
        py={SECTION_SPACING * 2}
        fz={'sm'}
        c={'dimmed'}
        ta={'center'}
      >
        <ThemeIcon size={ICON_WRAPPER_SIZE * 2} variant="light" radius={99}>
          <IconMoodPuzzled size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>

        <Stack align="center" ta={'center'} gap={0}>
          <Text inherit maw={280}>
            No {capitalizeWords(activeTab)}s found
          </Text>
        </Stack>
      </Stack>
    ) : (
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        {products
          .filter((pi) => pi.type == activeTab)
          .map((p, i) => (
            <CardMenuItem key={i} props={p} />
          ))}
      </SimpleGrid>
    );

  return (
    <Tabs
      value={activeTab}
      onChange={(v) => setActiveTab((v || '') as ProductType)}
      keepMounted={false}
      unstyled
      styles={{
        tab: {
          borderWidth: 0,
          backgroundColor: 'transparent',
        },
      }}
    >
      <TabsList>
        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <TabsTab value={ProductType.PIZZA}>
            <CardMenuItemGroup props={{ type: ProductType.PIZZA }} />
          </TabsTab>
          <TabsTab value={ProductType.SIDE}>
            <CardMenuItemGroup props={{ type: ProductType.SIDE }} />
          </TabsTab>
          <TabsTab value={ProductType.DRINK}>
            <CardMenuItemGroup props={{ type: ProductType.DRINK }} />
          </TabsTab>
          <TabsTab value={ProductType.SOUP}>
            <CardMenuItemGroup props={{ type: ProductType.SOUP }} />
          </TabsTab>
          <TabsTab value={ProductType.DESSERT}>
            <CardMenuItemGroup props={{ type: ProductType.DESSERT }} />
          </TabsTab>
          <TabsTab value={ProductType.SALAD}>
            <CardMenuItemGroup props={{ type: ProductType.SALAD }} />
          </TabsTab>
        </SimpleGrid>
      </TabsList>

      <Divider my={'lg'} />

      <TabsPanel value={ProductType.PIZZA}>{filteredItems}</TabsPanel>
      <TabsPanel value={ProductType.SIDE}>{filteredItems}</TabsPanel>
      <TabsPanel value={ProductType.DRINK}>{filteredItems}</TabsPanel>
      <TabsPanel value={ProductType.SOUP}>{filteredItems}</TabsPanel>
      <TabsPanel value={ProductType.DESSERT}>{filteredItems}</TabsPanel>
      <TabsPanel value={ProductType.SALAD}>{filteredItems}</TabsPanel>
    </Tabs>
  );
}
