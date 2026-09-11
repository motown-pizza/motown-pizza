'use client';

import React from 'react';
import {
  Avatar,
  Badge,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { OrderGet } from '@repo/types';
import { capitalizeWords } from '@repo/utils';
import { BadgeStatus } from '@repo/ui';
import { useStoreOrderItem } from '@repo/store';
import { getRegionalDate } from '@repo/utils';
import { BadgeOrderType } from '@repo/ui';
import { OrderFulfilmentType } from '@repo/types';
import { useStoreTable } from '@repo/store';
import { useStoreTableBooking } from '@repo/store';

export default function Order({ props }: { props: OrderGet }) {
  const { orderItems } = useStoreOrderItem();
  const { tableBookings } = useStoreTableBooking();
  const { tables } = useStoreTable();
  const tableBookingCurrent = tableBookings?.find((tb) => tb.id == props.tableBookingId);
  const tableCurrent = tables?.find((ti) => ti.id == tableBookingCurrent?.tableId);

  const orderItemsCurrent = orderItems?.filter((oi) => oi.orderId == props.id);
  const dateCreated = getRegionalDate(props.createdAt, {
    locale: 'en-GB',
    format: 'long',
  });

  const getSum = () => {
    let total = 0;

    orderItemsCurrent?.forEach((oi) => {
      total += oi.quantity * oi.priceAtSale;
    });

    return total;
  };

  const sum = getSum();

  return (
    <Card bg={'var(--mantine-color-dark-9)'}>
      <Stack>
        <Group align="start" justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <div>
              <Avatar key={props.customerName} name={props.customerName} color="initials" />
            </div>

            <div>
              <Title order={3} fz={'md'} fw={'bold'} lineClamp={1}>
                {capitalizeWords(props.customerName)}
              </Title>

              <Text fz={'sm'} c={'dimmed'} lineClamp={1}>
                {props.trackingCode}
              </Text>
            </div>
          </Group>

          <Group justify="end" gap={'xs'}>
            {props.fulfillmentType == OrderFulfilmentType.DINE_IN && (
              <Badge variant="light">{tableCurrent?.tableNumber}</Badge>
            )}
          </Group>
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

        <Group gap={'xs'}>
          <BadgeStatus props={{ status: props.orderStatus }} />
          <BadgeOrderType props={props} />
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
