'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  AvatarGroup,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Modal,
  NumberFormatter,
  ScrollAreaAutosize,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { OrderFulfilmentType, OrderGet, TableGet } from '@repo/types';
import { BadgeTableStatus, LayoutModal } from '@repo/ui';
import { useStoreTable, useStoreTableBooking } from '@repo/store';
import { useStoreOrder } from '@repo/store';
import { useOrderPlacementData } from '@repo/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { TableBookingStatus } from '@repo/types';
import { useStoreOrderPlacement } from '@repo/store';
import { useRouter } from 'next/navigation';
import { useTableBookingActions } from '@repo/store';
import { generateUUID } from '@repo/utils';
import { useTableStatus } from '@repo/hooks';
import { useOrderActions } from '@repo/store';
import { useDisclosure } from '@mantine/hooks';

type Occupant = { name: OrderGet['customerName']; phone: OrderGet['customerPhone'] };

export default function Table({ props }: { props: TableGet }) {
  const tableBookingIdRef = useRef(generateUUID());
  const router = useRouter();

  const { setOrderDetails } = useStoreOrderPlacement();
  const { orderUpdate } = useOrderActions();
  const { tableBookingCreate } = useTableBookingActions();
  const { orderDetails } = useOrderPlacementData();
  const { tableBookings } = useStoreTableBooking();
  const { orders } = useStoreOrder();
  const order = orders?.find((oi) => oi.id == orderDetails?.id);

  const { isBooked, isOccupied } = useTableStatus({ table: props });

  const [occupants, setOccupants] = useState<Occupant[]>([]);

  useEffect(() => {
    if (tableBookings === undefined) return;
    if (tableBookings === null) return;
    if (orders === undefined) return;
    if (orders === null) return;

    const getTableOccupants = () => {
      const activeTableBookings = tableBookings.filter(
        (tbi) => tbi.tableId == props.id && tbi.tableBookingStatus != TableBookingStatus.DONE,
      );

      const tableOrdersFound = orders.filter(
        (oi) =>
          oi.fulfillmentType == OrderFulfilmentType.DINE_IN &&
          !!oi.tableBookingId &&
          activeTableBookings.some((tbi) => tbi.id == oi.tableBookingId),
      );

      setOccupants(
        tableOrdersFound.map((oi) => {
          return {
            name: oi.customerName,
            phone: oi.customerPhone,
          };
        }),
      );
    };

    getTableOccupants();
  }, [tableBookings, orders]);

  const handleTableSelect = () => {
    if (order === undefined) return;
    if (order === null) return;
    if (orderDetails === undefined) return;
    if (orderDetails === null) return;

    tableBookingCreate({
      id: tableBookingIdRef.current,
      numberOfPersons: (orderDetails.guestCount || 0) + 1,
      tableBookingStatus: TableBookingStatus.WAITING,
      tableId: props.id,
    });

    const updatedOrderDetails = {
      ...orderDetails,
      ...order,
      tableBookingId: tableBookingIdRef.current,
    };

    setOrderDetails(updatedOrderDetails);

    setTimeout(() => {
      const updateOrders = async () => {
        await orderUpdate(updatedOrderDetails);
      };

      updateOrders();

      router.push(`/pos/menu?orderId=${updatedOrderDetails.id}`);
    }, 2000);
  };

  return (
    <Card bg={'var(--mantine-color-dark-8)'}>
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

          <Stack>
            <Group justify="end" mih={38}>
              <AvatarGroup>
                {occupants.map((oi, i) => (
                  <Tooltip
                    key={i}
                    label={
                      <div>
                        <Title order={3} fz={'sm'} fw={500}>
                          Customer Details
                        </Title>
                        <Text inherit>Name: {oi.name}</Text>
                        <Text inherit>Phone: {oi.phone}</Text>
                      </div>
                    }
                    multiline
                    miw={180}
                    maw={220}
                  >
                    <Avatar name={oi.name} color="initials" />
                  </Tooltip>
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
          </Stack>
        </Group>

        <Group justify="end" fz={'sm'} mih={21.7}>
          {!occupants.length ? null : (
            <ModalOccupant props={{ tableId: props.id, occupants }}>
              <Anchor inherit>Manage table</Anchor>
            </ModalOccupant>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

function ModalOccupant({
  props,
  children,
}: {
  props: { tableId: string; occupants: Occupant[] };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const tables = useStoreTable((s) => s.tables);
  const table = tables?.find((ti) => ti.id == props.tableId);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} padding={0}>
        <LayoutModal props={{ close, title: `Manage Table: ${table?.tableNumber}` }}>
          <ScrollAreaAutosize mih={240} mah={320}>
            {props.occupants
              // .concat(props.occupants.concat(props.occupants).concat(props.occupants))
              .map((oi, i) => (
                <div key={`${oi.name}-${oi.phone}`}>
                  {i > 0 && <Divider />}
                  <CardOccupant props={oi} tableId={props.tableId} />
                </div>
              ))}
          </ScrollAreaAutosize>
        </LayoutModal>
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}

function CardOccupant({ props, tableId }: { props: Occupant; tableId: string }) {
  const orders = useStoreOrder((s) => s.orders);
  const tableBookings = useStoreTableBooking((s) => s.tableBookings);
  const { tableBookingUpdate } = useTableBookingActions();

  const handleDismiss = () => {
    if (!orders) return;
    if (!tableBookings) return;

    const activeTableBookings = tableBookings.filter((tbi) => tbi.tableId == tableId);

    const tableOrdersFound = orders.filter(
      (oi) =>
        oi.fulfillmentType == OrderFulfilmentType.DINE_IN &&
        !!oi.tableBookingId &&
        activeTableBookings.some((tbi) => tbi.id == oi.tableBookingId),
    );

    let occupantsOrder: OrderGet | undefined;

    tableOrdersFound.map((oi) => {
      if (oi.customerName == props.name && oi.customerPhone == props.phone) {
        occupantsOrder = oi;
      }
    });

    const tableBooking = tableBookings.find((tbi) => tbi.id == occupantsOrder?.tableBookingId);

    if (tableBooking) tableBookingUpdate({ ...tableBooking, tableBookingStatus: 'DONE' });
  };

  return (
    <Card bg={'var(--mantine-color-dark-9)'} px={0}>
      <Grid align="center">
        <GridCol span={1.5}>
          <Avatar name={props.name} color="initials" />
        </GridCol>

        <GridCol span={7.5}>
          <div>
            <Title order={2} fz={'md'} fw={500}>
              {props.name}
            </Title>
            {props.phone && (
              <Text inherit fz={'sm'}>
                {props.phone}
              </Text>
            )}
          </div>
        </GridCol>

        <GridCol span={3}>
          <Group justify="end" wrap="nowrap">
            <Tooltip label={'dismiss'}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="red"
                variant="light"
                onClick={handleDismiss}
              >
                <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </GridCol>
      </Grid>
    </Card>
  );
}
