'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardSection,
  Divider,
  Group,
  Radio,
  RadioGroup,
  Stack,
  Title,
} from '@mantine/core';
import CardStoreAside from '@/components/common/cards/store/aside';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreOrderDetails } from '@/libraries/zustand/stores/order-details';
import { defaultOrderDetails } from '@/data/orders';
import { capitalizeWords } from '@repo/utilities/string';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';
import { stores } from '@/data/stores';
import { OrderTime, OrderType } from '@repo/types/models/enums';
import { getUrlParam } from '@repo/utilities/url';
import { PARAM_NAME } from '@repo/constants/names';
import { DateTimePicker } from '@mantine/dates';

export default function Order() {
  const { orderDetails, setOrderDetails } = useStoreOrderDetails();
  const pathname = usePathname();

  const isReviewCheckout = pathname.includes('/order/checkout-review');
  const isReadyForCheckout =
    pathname.includes('/order/select-menu') || isReviewCheckout;
  const productsSelected = !!orderDetails?.products.length;

  const store = stores.find(
    (s) => s.id == (orderDetails || defaultOrderDetails).store_id
  );

  useEffect(() => {
    const isStorePage = pathname.includes('/order/select-store');
    const orderType = getUrlParam(PARAM_NAME.ORDER_TYPE);

    if (isStorePage && orderType)
      setOrderDetails({
        ...(orderDetails || defaultOrderDetails),
        type: (orderType as string).toUpperCase() as OrderType,
      });
  }, []);

  return (
    <Box pos={'sticky'} top={SECTION_SPACING}>
      <Card bg={'var(--mantine-color-dark-8)'}>
        <CardSection p={'md'} bg={'var(--mantine-color-sec-6)'}>
          <Title order={2} fz={'lg'} fw={500} c={'blue.7'}>
            Order Settings
          </Title>
        </CardSection>

        <Stack gap={'xs'} mt={'md'}>
          <Stack gap={'xs'} mb={'xs'}>
            <Group align="end" justify="space-between">
              <Title order={3} fz={'md'} fw={500} c={'sec'}>
                My Store
              </Title>

              <NextLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
                fz={'sm'}
                c={'blue'}
              >
                Change Store
              </NextLink>
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
              value={(orderDetails || defaultOrderDetails).type}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  type: v as OrderType,
                });
              }}
            >
              <Stack mt="xs">
                <Radio
                  size="xs"
                  value={OrderType.COLLECTION}
                  label={capitalizeWords(OrderType.COLLECTION)}
                />
                <Radio
                  size="xs"
                  value={OrderType.DELIVERY}
                  label={capitalizeWords(OrderType.DELIVERY)}
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
              value={(orderDetails || defaultOrderDetails).time}
              onChange={(v) => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  time: v as OrderTime,
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

            {orderDetails?.time == OrderTime.LATER && (
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
                  ? 'Continue Checkout'
                  : 'Checkout'
                : 'Select item(s) to checkout'}
            </Button>
          </NextLink>
        </Group>
      )}
    </Box>
  );
}
