'use client';

import React, { useRef } from 'react';
import LayoutSection from '@repo/components/layout/section';
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
import IntroSection from '@repo/components/layout/intros/section';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { defaultOrderDetails } from '@/data/orders';
import {
  OrderFulfilmentType,
  OrderPaymentMethod,
  OrderTime,
  SyncStatus,
} from '@repo/types/models/enums';
import { stores } from '@/data/stores';
import FormContact from '@/components/form/contact';
import { APP_NAME } from '@/data/constants';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import NextLink from '@repo/components/common/anchor/next-link';
import { useOrderActions } from '@repo/hooks/actions/order';
import { generateUUID } from '@repo/utilities/generators';
import { useGetSum } from '@/hooks/order';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import CardMenuCart from '@/components/common/cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { getRegionalDate } from '@repo/utilities/date-time';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';

export default function Checkout() {
  const orderIdRef = useRef(generateUUID());
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { cartItems } = useStoreCartItem();
  const { orderCreate } = useOrderActions();
  const { getSum } = useGetSum();
  const { showNotification } = useNotification();

  const store = stores.find((s) => s.id == orderDetails?.store_id);

  const formIsValid =
    !!orderDetails?.customer_name.length &&
    !!orderDetails?.customer_phone?.length;

  const isReadyForConfirmation = formIsValid && !!cartItems?.length;

  const readyDate = getRegionalDate(new Date(), {
    locale: 'en-GB',
    format: 'numeric',
  });

  return (
    <LayoutSection
      id="page-checkout-review-content"
      padded
      containerized={'md'}
    >
      <IntroSection
        props={{ title: 'Checkout' }}
        options={{ alignment: 'start' }}
      />

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

          {orderDetails?.order_time == OrderTime.NOW && (
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
            <Text
              component="span"
              inherit
              fz={'md'}
              c={'var(--mantine-color-text)'}
            >
              Kshs.{' '}
              <Text component="span" inherit c={'sec'} fz={'lg'}>
                <NumberFormatter value={getSum()} />
              </Text>
            </Text>
          </Text>
        </Badge>
      </Stack>

      <Stack gap={'xl'} mt={'xl'}>
        <Card bg={'var(--mantine-color-dark-7)'} padding={0}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
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
        </Card>

        <Card bg={'var(--mantine-color-dark-7)'}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
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
                Sign In to your {APP_NAME}&apos;s Profile for faster checkout or
                continue below as guest.
              </Text>
            </div>

            <Card bg={'transparent'} withBorder w={{ md: '70%' }}>
              <FormContact options={{ order: true }} />
            </Card>
          </Stack>
        </Card>

        <Card bg={'var(--mantine-color-dark-7)'}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
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
              value={(orderDetails || defaultOrderDetails).payment_method}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  payment_method: v as OrderPaymentMethod,
                });
              }}
            >
              <Stack mt="xs">
                <Radio
                  value={OrderPaymentMethod.CASH}
                  label={
                    (orderDetails || defaultOrderDetails).fulfillment_type ==
                    OrderFulfilmentType.COLLECTION
                      ? 'Pay in store upon collection (Cash)'
                      : 'Pay on delivery (Cash)'
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
          <NextLink
            href={`/order/confirmed?confirmedOrder=${orderIdRef.current}`}
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

              await orderCreate(
                {
                  ...orderDetails,
                  id: orderIdRef.current,
                  sync_status: SyncStatus.PENDING,
                },
                { stores }
              );
            }}
          >
            <Button color="pri" size="md" disabled={!isReadyForConfirmation}>
              Continue
            </Button>
          </NextLink>
        </Group>
      </Stack>
    </LayoutSection>
  );
}
