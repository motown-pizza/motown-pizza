'use client';

import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { TableGet } from '@repo/types/models/table';
import BadgeTableStatus from '../badges/table-status';
import { useStoreTableBooking } from '@repo/libraries/zustand/stores/table-booking';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';

export default function Table({ props }: { props: TableGet }) {
  const { tableBookings } = useStoreTableBooking();
  const { orders } = useStoreOrder();

  const tableBookingIds = tableBookings
    ?.filter((tb) => tb.table_id == props.id)
    ?.map((tbc) => tbc.id);

  const ordersInBookings = orders?.filter(
    (oi) =>
      oi.table_booking_id && tableBookingIds?.includes(oi.table_booking_id)
  );

  let customers: any[] = [];

  ordersInBookings?.map((oib) => {
    customers.push({
      name: oib.customer_name,
      phone: oib.customer_phone,
    });
  });

  return (
    <Card bg={'var(--mantine-color-dark-9)'}>
      <Stack gap={'lg'}>
        <Group align="start" justify="space-between">
          <Group>
            <div>
              <Title order={3} fz={'md'} fw={'bold'}>
                Table {props.table_number}
              </Title>
            </div>
          </Group>

          <Stack align="end">
            <BadgeTableStatus props={props} />
          </Stack>
        </Group>

        <Group justify="space-between" c={'dimmed'} fz={'sm'}>
          <Group>
            <Text inherit>
              Seats: <NumberFormatter value={props.seat_count} />
            </Text>
          </Group>

          <Group justify="end">
            <AvatarGroup>
              <Avatar key={'Jane Smith'} name={'Jane Smith'} color="initials" />
              <Avatar key={'Mike Kane'} name={'Mike Kane'} color="initials" />
              <Avatar
                key={'Solomon Lane'}
                name={'Solomon Lane'}
                color="initials"
              />
              <Avatar>+5</Avatar>
            </AvatarGroup>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
