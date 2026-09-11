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
import { TableGet } from '@repo/types';
import { BadgeTableStatus } from '@repo/ui';
import { useStoreTableBooking } from '@repo/store';
import { useStoreOrder } from '@repo/store';
import { useOrderPlacementData } from '@repo/hooks';
import { IconCheck } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { TableBookingStatus } from '@repo/types';
import { useStoreOrderPlacement } from '@repo/store';
import { useRouter } from 'next/navigation';
import { useTableBookingActions } from '@repo/store';
import { generateUUID } from '@repo/utils';
import { useTableStatus } from '@repo/hooks';
import { useOrderActions } from '@repo/store';

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

    const handleCustomers = () => {
      const tableBookingIds = tableBookings
        ?.filter((tb) => tb.tableId == props.id)
        ?.map((tbc) => tbc.id);

      const ordersInBookings = orders?.filter(
        (oi) => oi.tableBookingId && tableBookingIds?.includes(oi.tableBookingId),
      );

      setCustomers(
        ordersInBookings?.map((oib) => {
          return { name: oib.customerName, phone: oib.customerPhone };
        }),
      );
    };

    handleCustomers();
  }, [tableBookings, orders]);

  const handleTableSelect = () => {
    if (orderDetails === undefined) return;
    if (orderDetails === null) return;

    tableBookingCreate({
      id: tableBookingIdRef.current,
      numberOfPersons: (orderDetails.guestCount || 0) + 1,
      tableBookingStatus: TableBookingStatus.WAITING,
      tableId: props.id,
    });

    setOrderDetails({
      ...orderDetails,
      tableBookingId: tableBookingIdRef.current,
    });

    setTimeout(() => {
      orderUpdate({
        ...orderDetails,
        tableBookingId: tableBookingIdRef.current,
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
                Table {props.tableNumber}
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
              Seats: <NumberFormatter value={props.seatCount} />
            </Text>
          </Group>

          <Group justify="end" mih={38}>
            <AvatarGroup>
              {customers.map((c, i) => (
                <Avatar key={i} name={c.name} color="initials" />
              ))}
            </AvatarGroup>

            {!!orderDetails?.customerName && (
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
