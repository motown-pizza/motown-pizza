'use client';

import React from 'react';
import {
  Avatar,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { OrderGet } from '@repo/types/models/order';
import { capitalizeWords } from '@repo/utilities/string';
import BadgeOrderStatus from '../badges/order-status';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { getRegionalDate } from '@repo/utilities/date-time';

export default function Order({ props }: { props: OrderGet }) {
  const { orderItems } = useStoreOrderItem();

  const orderItemsCurrent = orderItems?.filter((oi) => oi.order_id == props.id);
  const dateCreated = getRegionalDate(props.created_at, {
    locale: 'en-GB',
    format: 'long',
  });

  const getSum = () => {
    let total = 0;

    orderItemsCurrent?.forEach((oi) => {
      total += oi.quantity * oi.price_at_sale;
    });

    return total;
  };

  const sum = getSum();

  return (
    <Card bg={'var(--mantine-color-dark-9)'}>
      <Stack>
        <Group align="start" justify="space-between">
          <Group>
            <div>
              <Avatar
                key={props.customer_name}
                name={props.customer_name}
                color="initials"
              />
            </div>

            <div>
              <Title order={3} fz={'md'} fw={'bold'}>
                {capitalizeWords(props.customer_name)}
              </Title>

              <Text fz={'sm'} c={'dimmed'}>
                {props.tracking_code}
              </Text>
            </div>
          </Group>

          <Stack align="end">
            <BadgeOrderStatus props={props} />
          </Stack>
        </Group>

        <Group justify="space-between" c={'dimmed'} fz={'sm'}>
          <Text inherit>
            {dateCreated.date}, {dateCreated.time.toUpperCase()}
          </Text>

          {orderItemsCurrent?.length && (
            <Text inherit>
              <NumberFormatter value={orderItemsCurrent.length} /> items
            </Text>
          )}
        </Group>

        <Divider />

        <Group justify="space-between" fw={'500'}>
          <Text inherit>Total</Text>

          <Text inherit>
            Kshs.{' '}
            <Text component="span" inherit fw={'bold'} c={'sec'} fz={'lg'}>
              <NumberFormatter value={sum} />
            </Text>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
