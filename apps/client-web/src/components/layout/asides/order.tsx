'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardSection,
  Divider,
  Group,
  NumberFormatter,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import CardStoreAside from '@/components/common/cards/store/aside';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { defaultOrderDetails } from '@/data/orders';
import { capitalizeWords } from '@repo/utilities/string';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';
import { stores } from '@/data/stores';
import { OrderTime, OrderFulfilmentType } from '@repo/types/models/enums';
import { getUrlParam } from '@repo/utilities/url';
import { PARAM_NAME } from '@repo/constants/names';
import { DateTimePicker } from '@mantine/dates';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { useGetSum } from '@/hooks/order';

export default function Order() {
  const pathname = usePathname();

  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { cartItems } = useStoreCartItem();

  const { getSum } = useGetSum();

  const isStoreSelection = pathname.includes('/order/select-store');
  const isReviewCheckout = pathname.includes('/order/checkout-review');
  const isReadyForCheckout =
    pathname.includes('/order/select-menu') || isReviewCheckout;
  const productsSelected = !!cartItems?.length;

  const store = stores.find(
    (s) => s.id == (orderDetails || defaultOrderDetails).store_id
  );

  useEffect(() => {
    const isStorePage = pathname.includes('/order/select-store');
    const orderType = getUrlParam(PARAM_NAME.ORDER_TYPE);

    if (isStorePage && orderType)
      setOrderDetails({
        ...(orderDetails || defaultOrderDetails),
        fulfillment_type: (
          orderType as string
        ).toUpperCase() as OrderFulfilmentType,
      });
  }, []);

  return (
    <Box pos={'sticky'} top={SECTION_SPACING}>
      <Card bg={'var(--mantine-color-dark-8)'}>
        <CardSection p={'md'} bg={'var(--mantine-color-sec-6)'}>
          <Title order={2} fz={'lg'} fw={'bold'} c={'blue.7'}>
            Order Details
          </Title>
        </CardSection>

        <Stack gap={'xs'} mt={'md'}>
          <Stack gap={'xs'} mb={'xs'}>
            <Group align="end" justify="space-between">
              <Title order={3} fz={'md'} fw={500} c={'sec'}>
                My Store
              </Title>

              {!isStoreSelection && (
                <NextLink
                  href="/order/select-store?orderType=delivery"
                  fz={'sm'}
                  c={'blue'}
                >
                  Change Store
                </NextLink>
              )}
            </Group>

            {store && <CardStoreAside props={store} />}
          </Stack>

          <Divider />

          <Stack gap={'xs'} mb={'xs'}>
            <Title order={3} fz={'md'} fw={500} c={'sec'}>
              Order Type
            </Title>

            <RadioGroup
              name="order-type"
              aria-label="Order type"
              value={(orderDetails || defaultOrderDetails).fulfillment_type}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  fulfillment_type: v as OrderFulfilmentType,
                });
              }}
            >
              <Stack mt="xs">
                <Radio
                  size="xs"
                  value={OrderFulfilmentType.COLLECTION}
                  label={capitalizeWords(OrderFulfilmentType.COLLECTION)}
                />
                <Radio
                  size="xs"
                  value={OrderFulfilmentType.DELIVERY}
                  label={capitalizeWords(OrderFulfilmentType.DELIVERY)}
                />
              </Stack>
            </RadioGroup>
          </Stack>

          <Divider />

          <Stack gap={'xs'} mb={'xs'}>
            <Title order={3} fz={'md'} fw={500} c={'sec'}>
              Order Time
            </Title>

            <RadioGroup
              name="order-time"
              aria-label="Order time"
              value={(orderDetails || defaultOrderDetails).order_time}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  order_time: v as OrderTime,
                });
              }}
            >
              <Stack mt="xs">
                <Radio
                  size="xs"
                  value={OrderTime.NOW}
                  label={capitalizeWords(OrderTime.NOW)}
                />
                <Radio
                  size="xs"
                  value={OrderTime.LATER}
                  label={capitalizeWords(OrderTime.LATER)}
                />
              </Stack>
            </RadioGroup>

            {orderDetails?.order_time == OrderTime.LATER && (
              <DateTimePicker
                aria-label="Pick date and time"
                placeholder="Pick date and time"
                minDate={new Date()}
                maxDate={
                  // 3 weeks from now
                  new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7 * 3)
                }
              />
            )}
          </Stack>
        </Stack>

        {!isStoreSelection && (
          <CardSection p={'md'} mt={'md'} bg={'var(--mantine-color-dark-6)'}>
            <Group justify="space-between">
              <Text>Total:</Text>

              <Text fz={'sm'}>
                Kshs.{' '}
                <Text component="span" inherit fz={'md'} fw={500} c={'sec'}>
                  <NumberFormatter value={getSum()} />
                </Text>
              </Text>
            </Group>
          </CardSection>
        )}
      </Card>

      {isReadyForCheckout && (
        <Group mt={'md'}>
          <NextLink
            href={
              isReviewCheckout ? '/order/checkout' : '/order/checkout-review'
            }
            onClick={(e) => {
              if (!productsSelected) e.preventDefault();
            }}
            w={'100%'}
          >
            <Button fullWidth disabled={!productsSelected}>
              {productsSelected
                ? isReviewCheckout
                  ? 'Checkout'
                  : 'Review Checkout'
                : 'Select item(s) to checkout'}
            </Button>
          </NextLink>
        </Group>
      )}
    </Box>
  );
}
