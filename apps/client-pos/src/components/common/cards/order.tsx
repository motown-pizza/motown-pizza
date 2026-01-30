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
import { OrderGet } from '@repo/types/models/order';
import { capitalizeWords } from '@repo/utilities/string';
import BadgeOrderStatus from '../badges/order-status';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { getRegionalDate } from '@repo/utilities/date-time';
import BadgeOrderType from '../badges/order-type';
import { OrderFulfilmentType } from '@repo/types/models/enums';
import { useStoreTable } from '@repo/libraries/zustand/stores/table';
import { useStoreTableBooking } from '@repo/libraries/zustand/stores/table-booking';

export default function Order({ props }: { props: OrderGet }) {
  const { orderItems } = useStoreOrderItem();
  const { tableBookings } = useStoreTableBooking();
  const { tables } = useStoreTable();
  const tableBookingCurrent = tableBookings?.find(
    (tb) => tb.id == props.table_booking_id
  );
  const tableCurrent = tables?.find(
    (ti) => ti.id == tableBookingCurrent?.table_id
  );

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
        <Group align="start" justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <div>
              <Avatar
                key={props.customer_name}
                name={props.customer_name}
                color="initials"
              />
            </div>

            <div>
              <Title order={3} fz={'md'} fw={'bold'} lineClamp={1}>
                {capitalizeWords(props.customer_name)}
              </Title>

              <Text fz={'sm'} c={'dimmed'} lineClamp={1}>
                {props.tracking_code}
              </Text>
            </div>
          </Group>

          <Group justify="end" gap={'xs'}>
            {props.fulfillment_type == OrderFulfilmentType.DINE_IN && (
              <Badge variant="light">{tableCurrent?.table_number}</Badge>
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
          <BadgeOrderStatus props={props} />
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
