'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
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
import { useOrderPlacementData } from '@/hooks/order';
import { IconCheck } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { TableBookingStatus } from '@repo/types/models/enums';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { useRouter } from 'next/navigation';
import { useTableBookingActions } from '@repo/hooks/actions/table-booking';
import { generateUUID } from '@repo/utilities/generators';
import { useTableStatus } from '@/hooks/table';
import { useOrderActions } from '@repo/hooks/actions/order';

export default function Table({ props }: { props: TableGet }) {
  const tableBookingIdRef = useRef(generateUUID());
  const router = useRouter();

  const { setOrderDetails } = useStoreOrderPlacement();
  const { orderUpdate } = useOrderActions();
  const { tableBookingCreate } = useTableBookingActions();
  const { orderDetails } = useOrderPlacementData();
  const { tableBookings } = useStoreTableBooking();
  const { orders } = useStoreOrder();

  const { isBooked, isOccupied } = useTableStatus({ table: props });

  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (tableBookings === undefined) return;
    if (tableBookings === null) return;
    if (orders === undefined) return;
    if (orders === null) return;

    const tableBookingIds = tableBookings
      ?.filter((tb) => tb.table_id == props.id)
      ?.map((tbc) => tbc.id);

    const ordersInBookings = orders?.filter(
      (oi) =>
        oi.table_booking_id && tableBookingIds?.includes(oi.table_booking_id)
    );

    setCustomers(
      ordersInBookings?.map((oib) => {
        return { name: oib.customer_name, phone: oib.customer_phone };
      })
    );
  }, [tableBookings, orders]);

  const handleTableSelect = () => {
    if (orderDetails === undefined) return;
    if (orderDetails === null) return;

    tableBookingCreate({
      id: tableBookingIdRef.current,
      number_of_persons: (orderDetails.guest_count || 0) + 1,
      table_booking_status: TableBookingStatus.WAITING,
      table_id: props.id,
    });

    setOrderDetails({
      ...orderDetails,
      table_booking_id: tableBookingIdRef.current,
    });

    setTimeout(() => {
      orderUpdate({
        ...orderDetails,
        table_booking_id: tableBookingIdRef.current,
      });

      router.push(`/pos/menu?orderId=${orderDetails.id}`);
    }, 2000);
  };

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

          <Group justify="end" mih={38}>
            <AvatarGroup>
              {customers.map((c, i) => (
                <Avatar key={i} name={c.name} color="initials" />
              ))}
            </AvatarGroup>

            {!!orderDetails?.customer_name && (
              <ActionIcon
                size={34.8}
                // variant="light"
                disabled={isOccupied || isBooked}
                onClick={handleTableSelect}
              >
                <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
