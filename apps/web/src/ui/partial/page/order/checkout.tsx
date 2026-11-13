'use client';

import React, { useState } from 'react';
import { LayoutSection } from '@repo/ui';
import {
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  NumberFormatter,
  Radio,
  RadioGroup,
  ScrollArea,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import {
  useProfileActions,
  useStoreOrderPlacement,
  useStoreProduct,
  useStoreProductVariant,
  useStoreProfile,
  useStoreSession,
} from '@repo/store';
import {
  defaultOrderDetails,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  LOCAL_STORAGE_NAME,
  PARAM_NAME,
} from '@repo/constants';
import {
  DeliveryGet,
  OrderFulfilmentType,
  OrderPaymentMethod,
  OrderStatus,
  ProductType,
} from '@repo/types';
import { stores } from '@repo/constants';
import { ImageDefault } from '@repo/ui';
import { images } from '@repo/constants';
import { AnchorNextLink } from '@repo/ui';
import { useOrderActions } from '@repo/store';
import { useGetSum } from '@repo/hooks';
import { useStoreCartItem } from '@repo/store';
import CardMenuCart from '@web/ui/common/cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants';
import { getFromLocalStorage, segmentFullName, validators } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';
import { handleOrderNotification } from '@repo/handlers';
import PopoverGeolocation from '@web/ui/common/popover/geolocation';
import IndicatorFulfilment from '@web/ui/indicators/fulfilment';
import InputPayment from '@web/ui/inputs/payment';
import { IconBottle, IconCheck, IconSoup, IconStar } from '@tabler/icons-react';
import { mealDeal } from '@web/data/meal-deal';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const router = useRouter();
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { cartItems } = useStoreCartItem();
  const { productVariants } = useStoreProductVariant();
  const { products } = useStoreProduct();
  const { getSum } = useGetSum();
  const { showNotification } = useNotification();

  const storeId = getFromLocalStorage(LOCAL_STORAGE_NAME.STORE);
  const store = stores.find((s) => s.id == storeId);

  const { orderUpdate } = useOrderActions();

  const isReadyForConfirmation =
    !!cartItems?.length &&
    !!orderDetails?.customerPhone &&
    !validators.phone(orderDetails.customerPhone) &&
    !!orderDetails?.customerName &&
    (orderDetails?.fulfillmentType === 'COLLECTION' || !!orderDetails?.customerAddress);

  const sideProducts = products?.filter((pi) => pi.type == ProductType.SIDE);

  return (
    <LayoutSection id="page-checkout-review-content" margined mt={SECTION_SPACING / 2}>
      <Title order={1} c={'sec'}>
        Checkout
      </Title>

      <Grid mt={SECTION_SPACING}>
        <GridCol span={{ base: 12, md: 5 }}>
          <Stack>
            <Card bg={'transparent'} p={0} withBorder>
              <Box p={'md'} bg={'var(--mantine-color-dark-9)'}>
                <Group justify="space-between">
                  <Title order={3} c={'white'} fz={'md'}>
                    Order Items
                  </Title>

                  <Text ta={'end'} c={'dark.1'} fw={500} fz={'sm'}>
                    <NumberFormatter value={cartItems?.length} /> item(s)
                  </Text>
                </Group>
              </Box>

              <ScrollArea scrollbars={'y'} h={{ base: undefined, md: 400 }}>
                {cartItems === undefined ? (
                  <Center py={SECTION_SPACING * 2}>
                    <Loader />
                  </Center>
                ) : !cartItems?.length ? (
                  <Stack align="center" py={SECTION_SPACING * 2}>
                    <Text>No order items found.</Text>

                    <AnchorNextLink href="/order/select-menu?menuTab=pizzas-beef#page-select-menu-content">
                      <Group justify="center">
                        <Button>Select items to order</Button>
                      </Group>
                    </AnchorNextLink>
                  </Stack>
                ) : (
                  cartItems?.map((ci, i) => (
                    <Stack gap={5} key={i} pr={'xs'}>
                      {i > 0 && <Divider mb={'xs'} />}

                      <CardMenuCart
                        props={ci}
                        options={{ checkout: true }}
                      />
                    </Stack>
                  ))
                )}
              </ScrollArea>
            </Card>

            <Card
              bg="var(--mantine-color-dark-9)"
              withBorder
              style={{ borderColor: 'var(--mantine-color-sec-6)', borderWidth: 2, position: 'relative' }}
              p="md"
            >
              <Badge
                color="sec"
                c="black"
                radius="sm"
                style={{ position: 'absolute', top: -12, left: 16, zIndex: 1 }}
              >
                <Group gap={4}>
                  <IconSoup size={14} /> Add a side
                </Group>
              </Badge>

              <Group mt="sm" align="center" wrap="nowrap">
                <Group gap={4}>
                  <IconSoup size={32} color="var(--mantine-color-sec-6)" />
                  <IconBottle size={32} color="var(--mantine-color-sec-6)" />
                </Group>

                <Stack gap={0} style={{ flex: 1 }}>
                  <Text fw={600} c="white" fz="md">
                    {mealDeal.title}
                  </Text>
                  <Group gap="xs" align="baseline">
                    <Text fw={700} c="white" fz="lg">
                      Kshs. {mealDeal.price}
                    </Text>
                  </Group>
                </Stack>
              </Group>

              <Group mt="md" grow>
                <Select
                  data={mealDeal.drinkOptions}
                  defaultValue={mealDeal.drinkOptions[0]}
                  size="sm"
                  variant="filled"
                  comboboxProps={{ withinPortal: true }}
                />
                <Button
                  color="pri"
                  variant="light"
                  size="sm"
                  onClick={() => {
                    showNotification({
                      title: 'Coming soon',
                      desc: 'Meal deal ordering will be available soon.',
                      variant: Variant.WARNING,
                    });
                  }}
                >
                  Select
                </Button>
              </Group>
            </Card>

            <Card bg={'transparent'} withBorder p={0}>
              <Box p={'md'} bg={'var(--mantine-color-dark-9)'}>
                <Title order={3} c={'white'} fz={'md'}>
                  Add something on the side
                </Title>
              </Box>

              <Stack mt={'md'} mih={188.4}>
                {products === undefined ? (
                  <Center py={SECTION_SPACING}>
                    <Loader />
                  </Center>
                ) : !sideProducts?.length ? (
                  <Stack align="center" py={SECTION_SPACING}>
                    <Text>No sides found.</Text>
                  </Stack>
                ) : (
                  <ScrollArea scrollbars={'x'} pb={'md'}>
                    <Group wrap="nowrap" px={'md'}>
                      {sideProducts?.map((pi) => (
                        <Box key={pi.id} miw={{ base: 160, md: 200 }}>
                          <CardMenuMain props={pi} options={{ small: true }} />
                        </Box>
                      ))}
                    </Group>
                  </ScrollArea>
                )}
              </Stack>
            </Card>

            <Card bg={'transparent'} withBorder p={0}>
              <Box p={'md'} bg={'var(--mantine-color-dark-9)'}>
                <Title order={3} c={'white'} fz={'md'}>
                  Note for the kitchen
                </Title>
              </Box>

              <Stack p={'md'}>
                <Textarea
                  aria-label="Order note"
                  placeholder="Extra cheese, no olive oil..."
                  minRows={1}
                  maxRows={3}
                  autosize
                />
              </Stack>
            </Card>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          <Stack>
            <Card bg={'transparent'} withBorder p={0}>
              <Box p={'md'} bg={'var(--mantine-color-dark-9)'}>
                <Title order={3} c={'white'} fz={'md'}>
                  Order Details
                </Title>
              </Box>

              <Stack p={'md'}>
                <IndicatorFulfilment />

                <PopoverGeolocation options={{ checkout: true }} />

                <Box display={orderDetails?.fulfillmentType === 'COLLECTION' ? 'none' : 'block'}>
                  <Textarea
                    withAsterisk
                    label="Delivery address"
                    placeholder="Rhapta Road, Westlands, Nairobi"
                    minRows={1}
                    maxRows={3}
                    autosize
                    value={orderDetails?.customerAddress || ''}
                    onChange={(event) => {
                      if (orderDetails)
                        setOrderDetails({
                          ...orderDetails,
                          customerAddress: event.currentTarget.value,
                        });
                    }}
                  />
                </Box>

                <div>
                  <Textarea
                    withAsterisk
                    label="Phone number"
                    placeholder="Phone number"
                    minRows={1}
                    maxRows={3}
                    autosize
                    value={orderDetails?.customerPhone}
                    onChange={(event) => {
                      if (orderDetails)
                        setOrderDetails({
                          ...orderDetails,
                          customerPhone: event.currentTarget.value,
                        });
                    }}
                  />
                </div>

                <div>
                  <Textarea
                    withAsterisk
                    label="Name"
                    placeholder="Name"
                    minRows={1}
                    maxRows={3}
                    autosize
                    value={orderDetails?.customerName || ''}
                    onChange={(event) => {
                      if (orderDetails)
                        setOrderDetails({
                          ...orderDetails,
                          customerName: event.currentTarget.value,
                        });
                    }}
                  />
                </div>
              </Stack>
            </Card>

            <Card bg={'transparent'} withBorder>
              <CardSection p={'md'} bg={'var(--mantine-color-dark-9)'}>
                <Title order={3} c={'white'} fz={'md'}>
                  Payment Method
                </Title>
              </CardSection>

              <Stack mt={'md'}>
                <InputPayment
                  // value={payment}
                  // setValue={setPayment}
                  value={orderDetails?.paymentMethod}
                  setValue={(v: OrderPaymentMethod) => {
                    if (orderDetails)
                      setOrderDetails({
                        ...orderDetails,
                        paymentMethod: v,
                      });
                  }}
                />
              </Stack>
            </Card>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 3 }}>
          <Stack>
            <Card bg={'transparent'} withBorder p={0}>
              <Box p={'md'} bg={'var(--mantine-color-dark-9)'}>
                <Title order={3} c={'white'} fz={'md'}>
                  Order Summary
                </Title>
              </Box>

              <Stack>
                <div>
                  <ScrollArea scrollbars={'y'} h={{ md: 280 }} px={'md'}>
                    {cartItems === undefined ? (
                      <Center py={SECTION_SPACING}>
                        <Loader />
                      </Center>
                    ) : !cartItems?.length ? (
                      <Stack align="center" py={SECTION_SPACING * 2}>
                        <Text>No order items found.</Text>

                        <AnchorNextLink href="/order/select-menu?menuTab=pizzas-beef#page-select-menu-content">
                          <Group justify="center">
                            <Button>Select items to order</Button>
                          </Group>
                        </AnchorNextLink>
                      </Stack>
                    ) : (
                      <Stack gap={'xs'} py={'md'}>
                        {cartItems?.map((ci, i) => {
                          const variant = productVariants?.find(
                            (vi) => vi.id == ci.productVariantId,
                          );
                          const product = products?.find((pi) => pi.id == variant?.productId);

                          return (
                            <Group key={i} justify="space-between" fz={'sm'} c={'dark.1'} fw={500}>
                              <Text inherit>
                                {product?.title} ({ci.quantity})
                              </Text>

                              <Text inherit ta={'end'}>
                                <NumberFormatter value={(variant?.price || 0) * ci.quantity} />
                                /-
                              </Text>
                            </Group>
                          );
                        })}
                      </Stack>
                    )}
                  </ScrollArea>

                  <Box px={'md'}>
                    <Divider />
                  </Box>
                </div>

                <Stack gap="xs" px={'md'}>
  <Group justify="space-between" fz="sm">
    <Text c="dimmed">Subtotal</Text>
    <Text>Kshs. <NumberFormatter value={getSum()} /></Text>
  </Group>
  <Group justify="space-between" fz="sm">
    <Text c="dimmed">Delivery Fee</Text>
    <Text>Kshs. 150</Text>
  </Group>
  <Divider />
  <Group justify="space-between" fw={'bold'} c={'white'}>
    <Text inherit>Total:</Text>
    <Text component="span" inherit ta={'end'}>
      Kshs. <NumberFormatter value={getSum() + 150} />
    </Text>
  </Group>
</Stack>

                <Group grow px={'md'}>
                  <Button
                    onClick={async (e) => {
                      if (!isReadyForConfirmation) {
                        e.preventDefault();

                        showNotification({
                          title: 'Not Ready For Checkout',
                          desc: `Empty cart or invalid phone number, address, or name`,
                          variant: Variant.WARNING,
                        });

                        return;
                      }

                      let delivery: DeliveryGet | undefined;

                      if (orderDetails) {
                        // if (currentProfile && !currentProfile.phone) {
                        //   profileUpdate({ ...currentProfile, phone: orderDetails.customerPhone });
                        // }

                        const { orderDelivery } = await orderUpdate(
                          { ...orderDetails, orderStatus: OrderStatus.PREPARING },
                          { placement: true },
                        );

                        delivery = orderDelivery;
                      }

                      setOrderDetails(defaultOrderDetails);

                      if (orderDetails && orderDetails.customerPhone && store) {
                        handleOrderNotification({
                          order: { ...orderDetails },
                          total: getSum(),
                          store,
                          verificationCode: delivery?.verificationCode,
                        });
                      }

                      router.push(
                        `/order/confirmed?${PARAM_NAME.ORDER_CONFIRMED}=${orderDetails?.id}`,
                      );
                    }}
                    color="pri"
                    size="sm"
                    fullWidth
                    // disabled={!isReadyForConfirmation}
                  >
                    <Text component="span" inherit>
                      Pay Kshs. <NumberFormatter value={getSum()} /> (
                      {orderDetails?.paymentMethod == OrderPaymentMethod.ONLINE ? 'M-Pesa' : 'Cash'}
                      )
                    </Text>
                  </Button>
                </Group>

                <Group p={'md'} pt={0} gap={'xs'}>
                  <Card p={'xs'} bg={'transparent'} withBorder>
                    <Group gap={'xs'} wrap="nowrap" align="start">
                      <Box c={'ter'}>
                        <IconStar size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                      </Box>

                      <Text inherit fz={'xs'} c={'dark.1'}>
                        You&apos;ll earn points with this order towards a free 12-inch pizza.
                      </Text>
                    </Group>
                  </Card>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}


