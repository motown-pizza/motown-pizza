'use client';

import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Modal,
  NumberFormatter,
  ScrollAreaAutosize,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { OrderGet } from '@repo/types';
import { capitalizeWords } from '@repo/utils';
import { BadgeStatus, CardOrderItem, LayoutModal } from '@repo/ui';
import { useStoreOrder, useStoreOrderItem } from '@repo/store';
import { getRegionalDate } from '@repo/utils';
import { BadgeOrderType } from '@repo/ui';
import { OrderFulfilmentType } from '@repo/types';
import { useStoreTable } from '@repo/store';
import { useStoreTableBooking } from '@repo/store';
import { useDisclosure } from '@mantine/hooks';

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
    <Card bg={'var(--mantine-color-dark-8)'}>
      <Stack>
        <Group align="start" justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <div>
              <Avatar key={props.customerName} name={props.customerName} color="initials" />
            </div>

            <Box mih={44.1}>
              <Title order={3} fz={'md'} fw={'bold'} lineClamp={1}>
                {capitalizeWords(props.customerName)}
              </Title>

              <Text fz={'sm'} c={'dimmed'} lineClamp={1}>
                {props.trackingCode}
              </Text>
            </Box>
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
            <ModalComponent orderId={props.id}>
              <Text inherit c={'pri'}>
                <NumberFormatter value={orderItemsCurrent.length} /> items
              </Text>
            </ModalComponent>
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

function ModalComponent({ orderId, children }: { orderId: string; children: React.ReactNode }) {
  const orders = useStoreOrder((s) => s.orders);
  const order = orders?.find((oi) => oi.id == orderId);

  const orderItems = useStoreOrderItem((s) => s.orderItems);
  const orderItemsOrder = orderItems?.filter((oii) => oii.orderId == orderId);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} padding={0}>
        <LayoutModal props={{ close, title: `Order Items (${orderItemsOrder?.length})` }}>
          <div>
            <div>
              {order?.trackingCode && (
                <Text>
                  Order ID:{' '}
                  <Text component="span" inherit fw={500} c={'pri'}>
                    {order.trackingCode}
                  </Text>
                </Text>
              )}
              <Text>
                Customer Name:{' '}
                <Text component="span" inherit fw={500} c={'pri'}>
                  {order?.customerName}
                </Text>
              </Text>
            </div>

            <Divider mt={'md'} />

            <ScrollAreaAutosize mah={320}>
              <div>
                {orderItemsOrder?.map((oioi, i) => (
                  <div key={oioi.id}>
                    {i > 0 && <Divider />}
                    <CardOrderItem props={oioi} />
                  </div>
                ))}
              </div>
            </ScrollAreaAutosize>

            <Divider />
          </div>
        </LayoutModal>
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}
