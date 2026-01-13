'use client';

import React, { useRef } from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  Badge,
  Button,
  Card,
  CardSection,
  Divider,
  Group,
  NumberFormatter,
  Radio,
  RadioGroup,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import IntroSection from '@repo/components/layout/intros/section';
import { useStoreOrderPlacement } from '@/libraries/zustand/stores/order-placement';
import CardMenuSummary from '@/components/common/cards/menu/summary';
import { defaultOrderDetails } from '@/data/orders';
import { SyncStatus } from '@repo/types/models/enums';
import { stores } from '@/data/stores';
import FormContact from '@/components/form/contact';
import { APP_NAME } from '@/data/constants';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import NextLink from '@repo/components/common/anchor/next-link';
import { useOrderActions } from '@/hooks/actions/order';
import { generateUUID } from '@repo/utilities/generators';

export default function Checkout() {
  const orderIdRef = useRef(generateUUID());
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  const getSum = () => {
    let sum = 0;

    // orderDetails?.products.map((p) => {
    //   const variant = variants?.find((v) => v.id == p.selected_variant_id);
    //   if (variant?.price) sum += variant.price;
    // });

    return sum;
  };

  const getVat = () => {
    let sum = getSum();
    sum = (30 / 100) * sum;
    return sum;
  };

  const store = stores.find((s) => s.id == orderDetails?.store_id);

  const formIsValid =
    !!orderDetails?.customer_name.length &&
    !!orderDetails?.customer_phone?.length;

  // const isReadyForConfirmation = formIsValid && !!orderDetails.products.length;

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
          <Text>
            Carryout from {store?.title}, {store?.location}.
          </Text>
          <Text>Your order will be ready on: 04/12/25 12:00.</Text>
        </div>

        <Badge size="xl" color="var(--mantine-color-dark-7)" tt={'capitalize'}>
          <Text inherit>
            Total:{' '}
            <Text component="span" inherit>
              <NumberFormatter value={getSum() + getVat()} /> KES
            </Text>
          </Text>
        </Badge>
      </Stack>

      <Stack gap={'xl'} mt={'xl'}>
        <Card bg={'var(--mantine-color-dark-7)'}>
          <CardSection p={'md'} bg={'var(--mantine-color-dark-6)'}>
            <Title order={3} c={'blue'}>
              Order Items Summary
            </Title>
          </CardSection>

          <ScrollArea w={'100%'} scrollbars={'x'} type="auto">
            {/* <Stack mt={'md'} miw={900} pb={'lg'}>
              {(orderDetails || defaultOrderDetails).products.map((pi, i) => (
                <Stack gap={5} key={i}>
                  {i > 0 && <Divider mb={'xs'} />}

                  <CardMenuSummary props={pi} />
                </Stack>
              ))}
            </Stack> */}
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
                  <NumberFormatter value={getSum() + getVat()} /> KES
                </Text>
              </Text>
            </div>

            <RadioGroup
              name="payment-option"
              label="Payment Option"
              withAsterisk
              // value={(orderDetails || defaultOrderDetails).payment_option}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  // payment_option: v as OrderPaymentOption,
                });
              }}
            >
              <Stack mt="xs">
                {/* {(orderDetails || defaultOrderDetails).type ==
                  OrderType.COLLECTION && (
                  <Radio
                    value={OrderPaymentOption.CASH_STORE}
                    label={'Pay in Store'}
                  />
                )} */}

                {/* <Radio
                  value={OrderPaymentOption.CASH_ON_DELIVERY}
                  label={'Pay on Delivery (Cash)'}
                /> */}

                <Radio
                  // value={OrderPaymentOption.E_CASH}
                  label={
                    <Stack gap={5}>
                      <Text inherit>Pay now with mobile money</Text>

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
            onClick={(e) => {
              // if (!isReadyForConfirmation) {
              //   e.preventDefault();
              //   return;
              // }

              orderCreate({
                ...orderDetails,
                id: orderIdRef.current,
                // stage: OrderStage.CHECKOUT,
                sync_status: SyncStatus.PENDING,
              });
            }}
          >
            <Button
              color="pri"
              size="md"
              // disabled={!isReadyForConfirmation}
            >
              Continue
            </Button>
          </NextLink>
        </Group>
      </Stack>
    </LayoutSection>
  );
}
