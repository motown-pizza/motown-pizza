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
import { capitalizeWords } from '@repo/utils';
import {
  OrderFulfilmentType,
  OrderStatus,
  ProductDietarySubType,
  ProductGet,
  ProductType,
  Status,
  StockMovementType,
  SyncStatus,
} from '@repo/types';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import {
  IconArrowLeft,
  IconBeer,
  IconBowl,
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
import { AnchorNextLink } from '@repo/ui';
import { APP_SHELL } from '@pos/data/constants';
import CardMenuItem from '@pos/ui/common/cards/menu-item';
import {
  useCartItemActions,
  useDeliveryActions,
  useStoreOrder,
  useStoreProduct,
} from '@repo/store';
import { getRegionalDate } from '@repo/utils';
import CardCartItem from '../../../common/cards/cart-item';
import { useStoreOrderPlacement } from '@repo/store';
import { useStoreCartItem } from '@repo/store';
import { useStoreProductVariant } from '@repo/store';
import { useOrderPlacementData } from '@repo/hooks';
import { useStoreTable } from '@repo/store';
import { useStoreTableBooking } from '@repo/store';
import { useOrderActions } from '@repo/store';
import { useRouter } from 'next/navigation';
import { PARAM_NAME } from '@repo/constants';
import { defaultOrderDetails } from '@repo/constants';
import { useStoreIngredient } from '@repo/store';
import { useStoreStockMovement } from '@repo/store';
import { useStoreRecipieItem } from '@repo/store';
import { IngredientGet } from '@repo/types';
import { StockMovementGet } from '@repo/types';
import { generateUUID } from '@repo/utils';

export default function Menu() {
  const { orderDetails } = useOrderPlacementData();
  const { tableBookings } = useStoreTableBooking();
  const tableBookingCurrent = tableBookings?.find((tbi) => tbi.id == orderDetails?.tableBookingId);
  const { tables } = useStoreTable();
  const tableCurrent = tables?.find((ti) => ti.id == tableBookingCurrent?.tableId);

  return (
    <>
      <Grid gap={0}>
        <GridCol span={orderDetails?.customerName ? 9 : 12}>
          <Group
            align="start"
            justify="space-between"
            pos={'sticky'}
            top={0}
            py={'lg'}
            pr={'lg'}
            mih={83.3}
            style={{
              backgroundColor: 'var(--mantine-color-dark-9)',
              zIndex: 2,
            }}
          >
            <Group>
              <AnchorNextLink href={'/pos'}>
                <Group>
                  <ActionIcon size={ICON_WRAPPER_SIZE}>
                    <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Group>
              </AnchorNextLink>

              <Title order={2}>Orders</Title>
            </Group>

            {orderDetails?.customerName && (
              <Card padding={0} bg={'transparent'} radius={0}>
                <Group justify="space-between" gap={'xs'}>
                  <Avatar
                    key={orderDetails.customerName}
                    name={orderDetails.customerName}
                    color="initials"
                  />

                  <Stack gap={0} justify="center" mih={43.3}>
                    <Title order={2} fz={'md'} fw={'bold'} miw={160}>
                      {orderDetails.customerName}
                    </Title>

                    <Text inherit fz={'sm'} c={'dimmed'}>
                      {orderDetails.fulfillmentType == OrderFulfilmentType.DINE_IN
                        ? `Table No: ${tableCurrent?.tableNumber}`
                        : `Fulfilment: ${capitalizeWords(orderDetails.fulfillmentType)}`}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            )}
          </Group>

          <Box pr={'lg'} pb={'lg'}>
            <TabsMenu />
          </Box>
        </GridCol>

        {orderDetails?.customerName && (
          <GridCol span={3}>
            <Box pos={'sticky'} top={0} pt={'lg'}>
              <CardOrderDetails />
            </Box>
          </GridCol>
        )}
      </Grid>
    </>
  );
}

function CardOrderDetails() {
  const router = useRouter();

  const orderDetails = useStoreOrderPlacement((s) => s.orderDetails);
  const clearOrderDetails = useStoreOrderPlacement((s) => s.clearOrderDetails);
  const orders = useStoreOrder((s) => s.orders);
  const order = orders?.find((oi) => oi.id == orderDetails?.id);
  const tableBookings = useStoreTableBooking((s) => s.tableBookings);
  const deleteTableBooking = useStoreTableBooking((s) => s.deleteTableBooking);
  const tableBooking = tableBookings?.find((tbi) => tbi.id == orderDetails?.tableBookingId);
  const tables = useStoreTable((s) => s.tables);
  const table = tables?.find((ti) => ti.id == tableBooking?.tableId);
  const { orderUpdate, orderDelete } = useOrderActions();
  const { cartItemsDelete } = useCartItemActions();
  const { cartItems, setCartItems } = useStoreCartItem();
  // const { ingredients, setIngredients } = useStoreIngredient();
  // const { stockMovements, setStockMovements } = useStoreStockMovement();
  const { productVariants } = useStoreProductVariant();
  const { recipieItems } = useStoreRecipieItem();
  const { deliveryCreate } = useDeliveryActions();

  const getSum = () => {
    let total = 0;

    cartItems?.map((ci) => {
      const productVariant = productVariants?.find((pv) => pv.id == ci.productVariantId);

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

    if (tableBooking) deleteTableBooking(tableBooking);

    const now = new Date();

    if (cartItems?.length)
      cartItemsDelete(
        cartItems.map((ci) => {
          return {
            ...ci,
            syncStatus: SyncStatus.DELETED,
            updatedAt: now.toISOString() as any,
          };
        }),
      );

    if (order) orderDelete(order);

    clearOrderDetails();

    router.push(`/pos`);
  };

  const handlePlaceOrder = () => {
    if (order === undefined) return;
    if (order === null) return;

    setLoadingPlace(true);

    const result = orderUpdate(
      { ...orderDetails, ...order, orderStatus: OrderStatus.PREPARING },
      { placement: true },
    );

    if (result.cartToOrderItems) {
      // const productVariantIds = result.cartToOrderItems.map((ci) => ci.productVariantId);
      // const recipieItemsOrdered = recipieItems?.filter((ri) =>
      //   productVariantIds.includes(ri.productVariantId),
      // );
      // const deductionMap = new Map<string, number>();
      // recipieItemsOrdered?.forEach((rio) => {
      //   const existing = deductionMap.get(rio.ingredientId) || 0;
      //   deductionMap.set(rio.ingredientId, existing + (rio.quantityNeeded || 0));
      // });
      // const now = new Date();
      // const updatedIngredients: IngredientGet[] = [];
      // const updatedStockMovements: StockMovementGet[] = [];
      // ingredients?.forEach((ii) => {
      //   const deduction = deductionMap.get(ii.id) || 0;
      //   if (deduction > 0) {
      //     const updatedIngredient: IngredientGet = {
      //       ...ii,
      //       stockQuantity: ii.stockQuantity - deduction,
      //       syncStatus: SyncStatus.PENDING,
      //       updatedAt: now.toISOString() as any,
      //     };
      //     updatedIngredients.push(updatedIngredient);
      //     updatedStockMovements.push({
      //       id: generateUUID(),
      //       ingredientId: ii.id,
      //       orderId: order.id,
      //       type: StockMovementType.CONSUMPTION,
      //       quantity: deduction,
      //       status: Status.ACTIVE,
      //       syncStatus: SyncStatus.PENDING,
      //       createdAt: now,
      //       updatedAt: now,
      //     });
      //   } else {
      //     updatedIngredients.push(ii);
      //   }
      // });
      // setIngredients(updatedIngredients);
      // setStockMovements([...(stockMovements || []), ...updatedStockMovements]);
    }

    clearOrderDetails();

    router.push(`/pos/order-confirmed?${PARAM_NAME.ORDER_CONFIRMED}=${order.id}`);
  };

  return !orderDetails?.customerName ? null : (
    <Card bg={'var(--mantine-color-dark-9)'} withBorder padding={0}>
      <CardSection
        pos={'sticky'}
        top={0}
        style={{ zIndex: 1 }}
        bg={'var(--mantine-color-dark-8)'}
        p={'md'}
      >
        <Group justify="space-between" align="start">
          <Stack gap={0} mih={40.2} justify="space-between">
            <Title order={2} fz={'md'} fw={500}>
              {order?.trackingCode || `Order for table ${table?.tableNumber}`}
            </Title>

            <Text inherit c={'dimmed'} fz={'xs'}>
              {
                getRegionalDate(!orderDetails ? new Date() : orderDetails.createdAt, {
                  locale: 'en-GB',
                  format: 'long',
                }).date
              }
            </Text>
          </Stack>

          <Group justify="end" gap={'xs'}>
            <Avatar
              key={orderDetails.customerName}
              name={orderDetails.customerName}
              color="initials"
            />
          </Group>
        </Group>
      </CardSection>
      {/* <Divider mb={'md'} color="gray" /> */}
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
              // pb={'xs'}
            >
              <Title order={3} fz={'md'}>
                Order Details
              </Title>

              <Divider mt={'xs'} />
            </Box>

            {cartItems === undefined ? (
              <Stack align="center" py={SECTION_SPACING}>
                <Loader />
                <Text inherit fz={'sm'} c={'dimmed'}>
                  Fetching cart items
                </Text>
              </Stack>
            ) : !cartItems?.length ? (
              <Stack align="center" py={SECTION_SPACING} fz={'sm'} c={'dimmed'} ta={'center'}>
                <ThemeIcon size={ICON_WRAPPER_SIZE * 2} variant="light" radius={99}>
                  <IconMoodPuzzled size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
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
                  <Text component="span" inherit fw={'bold'} fz={'lg'} c={'sec'}>
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
                color="gray"
                leftSection={<IconCash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
              >
                Cash
              </Button>
            )}

            {cartItems === undefined ? (
              <Skeleton h={36} />
            ) : (
              <Button
                disabled={!cartItems?.length}
                color="gray"
                leftSection={<IconCreditCard size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
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
                leftSection={<IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                color="pri"
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
                leftSection={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                color="ter"
                c={!cartItems?.length ? undefined : 'var(--mantine-color-black)'}
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
  const { products } = useStoreProduct();

  const cardProps = { bg: '', c: '', icon: IconPizza, type: '', length: 0 };

  switch (props.type) {
    case ProductType.PIZZA:
      cardProps.bg = 'violet';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconPizza;
      cardProps.type = ProductType.PIZZA;
      cardProps.length = products?.filter((pi) => pi.type == ProductType.PIZZA).length || 0;
      break;
    case ProductType.DRINK:
      cardProps.bg = 'indigo';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconBeer;
      cardProps.type = ProductType.DRINK;
      cardProps.length = products?.filter((pi) => pi.type == ProductType.DRINK).length || 0;
      break;
    case ProductType.SIDE:
      cardProps.bg = 'pink';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconMeat;
      cardProps.type = ProductType.SIDE;
      cardProps.length =
        products?.filter((pi) => pi.type == ProductType.SIDE && !pi.dietarySubClass).length || 0;
      break;
    case ProductType.SAUCE:
      cardProps.bg = 'orange';
      cardProps.c = 'var(--mantine-color-white)';
      cardProps.icon = IconBowl;
      cardProps.type = ProductType.SAUCE;
      cardProps.length =
        products?.filter((pi) => pi.dietarySubClass == ProductType.SAUCE).length || 0;
      break;

    default:
      break;
  }

  return (
    <Card bg={`${cardProps.bg}.7`} c={cardProps.c} style={{ cursor: 'pointer' }}>
      <Stack gap={'lg'} ta={'start'}>
        <Group gap={5}>
          <cardProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

          <Title order={3} c={cardProps.c} fz={'lg'}>
            {capitalizeWords(props.type)}s
          </Title>
        </Group>

        <Text inherit fz={'sm'}>
          <NumberFormatter value={cardProps.length} /> items
        </Text>
      </Stack>
    </Card>
  );
}

function TabsMenu() {
  const orderDetails = useStoreOrderPlacement((s) => s.orderDetails);
  const [activeTab, setActiveTab] = useState<ProductType>(ProductType.PIZZA);
  const { products } = useStoreProduct();

  const getFilteredItems = (type: ProductType) => {
    let productsCurrent: ProductGet[] = [];

    switch (type) {
      case ProductType.PIZZA:
        productsCurrent = (products || []).filter((pi) => pi.type == ProductType.PIZZA);
        break;
      case ProductType.SIDE:
        productsCurrent = (products || []).filter(
          (pi) => pi.type == ProductType.SIDE && !pi.dietarySubClass,
        );
        break;
      case ProductType.DRINK:
        productsCurrent = (products || []).filter((pi) => pi.type == ProductType.DRINK);
        break;
      case ProductType.SAUCE:
        productsCurrent = (products || []).filter((pi) => pi.dietarySubClass == ProductType.SAUCE);
        break;

      default:
        break;
    }

    return products === undefined ? (
      <Stack align="center" py={SECTION_SPACING * 2}>
        <Loader />
        <Text inherit fz={'sm'} c={'dimmed'}>
          Fetching menu items
        </Text>
      </Stack>
    ) : !products?.length ? (
      <Stack align="center" py={SECTION_SPACING * 2} fz={'sm'} c={'dimmed'} ta={'center'}>
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
      <Stack align="center" py={'SECTION_SPACING * 2'} fz={'sm'} c={'dimmed'} ta={'center'}>
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
      <SimpleGrid cols={{ base: 1, md: !orderDetails?.customerName ? 4 : 3 }} pb={0}>
        {productsCurrent.map((p, i) => (
          <CardMenuItem key={i} props={p} />
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Tabs
      value={activeTab}
      onChange={(v) => setActiveTab((v || '') as ProductType)}
      keepMounted={true}
      unstyled
      styles={{
        tab: {
          borderWidth: 0,
          backgroundColor: 'transparent',
        },
      }}
    >
      <TabsList>
        <SimpleGrid cols={{ base: 1, md: 4 }}>
          <TabsTab value={ProductType.PIZZA}>
            <CardMenuItemGroup
              props={{
                type: ProductType.PIZZA,
              }}
            />
          </TabsTab>
          <TabsTab value={ProductType.SIDE}>
            <CardMenuItemGroup
              props={{
                type: ProductType.SIDE,
              }}
            />
          </TabsTab>
          <TabsTab value={ProductType.DRINK}>
            <CardMenuItemGroup
              props={{
                type: ProductType.DRINK,
              }}
            />
          </TabsTab>
          <TabsTab value={ProductType.SAUCE}>
            <CardMenuItemGroup
              props={{
                type: ProductType.SAUCE,
              }}
            />
          </TabsTab>
        </SimpleGrid>
      </TabsList>

      <Divider my={'lg'} />

      <TabsPanel value={ProductType.PIZZA}>{getFilteredItems(ProductType.PIZZA)}</TabsPanel>
      <TabsPanel value={ProductType.SIDE}>{getFilteredItems(ProductType.SIDE)}</TabsPanel>
      <TabsPanel value={ProductType.DRINK}>{getFilteredItems(ProductType.DRINK)}</TabsPanel>
      <TabsPanel value={ProductType.SAUCE}>{getFilteredItems(ProductType.SAUCE)}</TabsPanel>
    </Tabs>
  );
}
