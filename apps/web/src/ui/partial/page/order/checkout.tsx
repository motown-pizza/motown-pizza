'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import {
  Badge,
  Button,
  Card,
  CardSection,
  Center,
  Divider,
  Group,
  Loader,
  NumberFormatter,
  Radio,
  RadioGroup,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { LayoutIntroSection } from '@repo/ui';
import { useStoreOrderPlacement } from '@repo/store';
import { defaultOrderDetails, PARAM_NAME } from '@repo/constants';
import { OrderFulfilmentType, OrderPaymentMethod, OrderStatus, OrderTime } from '@repo/types';
import { stores } from '@repo/constants';
import { FormContact } from '@repo/ui';
import { APP_NAME } from '@repo/constants';
import { ImageDefault } from '@repo/ui';
import { images } from '@repo/constants';
import { AnchorNextLink } from '@repo/ui';
import { useOrderActions } from '@repo/store';
import { useGetSum } from '@repo/hooks';
import { useStoreCartItem } from '@repo/store';
import CardMenuCart from '@web/ui/common/cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants';
import { getRegionalDate, validators } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

export default function Checkout() {
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { cartItems } = useStoreCartItem();
  const { getSum } = useGetSum();
  const { showNotification } = useNotification();

  const store = stores.find((s) => s.id == orderDetails?.storeId);
  const { orderUpdate } = useOrderActions();

  const isReadyForConfirmation =
    !!cartItems?.length &&
    (!orderDetails
      ? false
      : orderDetails.customerName.length > 1 &&
        (!orderDetails.customerPhone
          ? false
          : validators.phone(orderDetails.customerPhone) == false));

  const readyDate = getRegionalDate(new Date(), {
    locale: 'en-GB',
    format: 'numeric',
  });

  return (
    <LayoutSection id="page-checkout-review-content" padded containerized={'md'}>
      <LayoutIntroSection props={{ title: 'Checkout' }} options={{ alignment: 'start' }} />

      <Stack mt={'xl'}>
        <div>
          {store && (
            <Text c={'dimmed'}>
              Carryout from:{' '}
              <Text component="span" inherit c={'var(--mantine-color-text)'}>
                {store.title}, {store.location}
              </Text>
              .
            </Text>
          )}

          {orderDetails?.orderTime == OrderTime.NOW && (
            <Text c={'dimmed'}>
              Your order will be ready on:{' '}
              <Text component="span" inherit c={'var(--mantine-color-text)'}>
                {readyDate.date}, {readyDate.time.toUpperCase()}
              </Text>
              .
            </Text>
          )}
        </div>

        <Badge size="xl" color="var(--mantine-color-dark-7)" tt={'capitalize'}>
          <Text inherit c={'dimmed'} fz={'sm'}>
            Total:{' '}
            <Text component="span" inherit fz={'md'} c={'var(--mantine-color-text)'}>
              Kshs.{' '}
              <Text component="span" inherit c={'sec'} fz={'lg'}>
                <NumberFormatter value={getSum()} />
              </Text>
            </Text>
          </Text>
        </Badge>
      </Stack>

      <Stack gap={'xl'} mt={'xl'}>
        <Card bg={'var(--mantine-color-dark-8)'} padding={0}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-7)'}>
            <Title order={3} c={'blue'}>
              Order Items Summary
            </Title>
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
        </Card>

        <Card bg={'var(--mantine-color-dark-8)'}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-7)'}>
            <Title order={3} c={'blue'}>
              Step 1: Contact Info
            </Title>
          </CardSection>

          <Stack mt={'md'}>
            <div>
              <Title order={4} fz={'lg'}>
                Personal Information
              </Title>

              <Text>
                The information you provide will be used to contact you regarding your order.
              </Text>
            </div>

            <Card bg={'transparent'} withBorder w={{ md: '70%' }}>
              <FormContact options={{ order: true }} />
            </Card>

            <Text fz={'sm'} c={'dimmed'}>
              You can also sign in to your {APP_NAME.WEB} profile for faster checkout.
            </Text>
          </Stack>
        </Card>

        <Card bg={'var(--mantine-color-dark-8)'}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-7)'}>
            <Title order={3} c={'blue'}>
              Step 2: Select Payment Method
            </Title>
          </CardSection>

          <Stack mt={'md'}>
            <div>
              <Title order={4} fz={'lg'}>
                Payment Information
              </Title>

              <Text c={'sec'}>
                Balance Due:{' '}
                <Text component="span" inherit fw={500}>
                  <NumberFormatter value={getSum()} /> KES
                </Text>
              </Text>
            </div>

            <RadioGroup
              name="payment-option"
              label="Payment Option"
              withAsterisk
              value={(orderDetails || defaultOrderDetails).paymentMethod}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  paymentMethod: v as OrderPaymentMethod,
                });
              }}
            >
              <Stack mt="xs">
                <Radio
                  value={OrderPaymentMethod.CASH}
                  label={
                    (orderDetails || defaultOrderDetails).fulfillmentType ==
                    OrderFulfilmentType.COLLECTION
                      ? 'Pay in store upon collection (Cash)'
                      : 'Pay on delivery/collection (Cash)'
                  }
                />

                <Radio
                  value={OrderPaymentMethod.ONLINE}
                  label={
                    <Stack gap={5}>
                      <Text inherit>Pay with cash, card, or mobile money</Text>

                      <Group>
                        <ImageDefault
                          src={images.mpesa}
                          alt="M-Pesa"
                          height={48}
                          width={48}
                          fit={'contain'}
                        />
                      </Group>
                    </Stack>
                  }
                />
              </Stack>
            </RadioGroup>
          </Stack>
        </Card>

        <Group justify="end">
          <AnchorNextLink
            href={`/order/confirmed?${PARAM_NAME.ORDER_CONFIRMED}=${orderDetails?.id}`}
            onClick={async (e) => {
              if (!isReadyForConfirmation) {
                e.preventDefault();

                showNotification({
                  title: 'Not Ready For Checkout',
                  desc: `Verify form details and order items`,
                  variant: Variant.WARNING,
                });

                return;
              }

              if (orderDetails) {
                orderUpdate(
                  { ...orderDetails, orderStatus: OrderStatus.PREPARING },
                  { placement: true },
                );
              }

              setOrderDetails(defaultOrderDetails);
            }}
          >
            <Button color="pri" size="md" disabled={!isReadyForConfirmation}>
              Continue
            </Button>
          </AnchorNextLink>
        </Group>
      </Stack>
    </LayoutSection>
  );
}
