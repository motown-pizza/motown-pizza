'use client';

import React from 'react';
import {
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useStoreOrder, useStoreOrderItem } from '@repo/store';
import { OrderGet } from '@repo/types';
import { BadgeOrderType, ButtonCopy, CardOrderItem, LayoutSection } from '@repo/ui';
import { getRegionalDate } from '@repo/utils';
import { useGetSumOrderItems } from '@repo/hooks';
import { SECTION_SPACING } from '@repo/constants';

export default function Order({ orderId }: { orderId: string }) {
  const orders = useStoreOrder((s) => s.orders);
  const order = orders?.find((oi) => oi.id == orderId);
  const orderItems = useStoreOrderItem((s) => s.orderItems);
  const orderItemsOrder = orderItems?.filter((oii) => oii.orderId == orderId);

  const orderDate = getRegionalDate(order?.createdAt || now);

  return (
    <LayoutSection id="page-order-content" padded>
      <Grid gap={'xl'}>
        <GridCol span={{ base: 12, md: 8 }} order={{ base: 2, md: 1 }}>
          <Stack pr={{ md: 'xl' }}>
            <Title order={3} c={'sec'}>
              Order Items
            </Title>

            <div>
              {orderItemsOrder?.map((oioi, i) => (
                <div key={oioi.id}>
                  {i > 0 && <Divider />}
                  <CardOrderItem props={oioi} />
                </div>
              ))}
            </div>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }} order={{ base: 1, md: 2 }}>
          <Stack gap={'xl'} pos={'sticky'} top={SECTION_SPACING}>
            <Stack gap={'xs'}>
              <Group>
                <Title order={3}>{order?.trackingCode}</Title>
                <ButtonCopy clipboardItem={order?.trackingCode} />
              </Group>

              <div>
                <Text inherit c={'sec'}>
                  Order Date/Time:{' '}
                  <Text component="span" inherit fw={500} c={'var(--mantine-color-text)'}>
                    {orderDate.date}, {orderDate.time.toUpperCase()}
                  </Text>
                </Text>
              </div>
            </Stack>

            {order && <CardOrderAside props={order} />}
          </Stack>
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}

const now = new Date();

function CardOrderAside({ props }: { props: OrderGet }) {
  const { getSum } = useGetSumOrderItems({ orderId: props.id });

  return (
    <Card withBorder bg={'var(--mantine-color-dark-9)'}>
      <Stack>
        <Group justify="space-between">
          <Text inherit>Name on Order:</Text>
          <Text inherit fw={500}>
            {props.customerName}
          </Text>
        </Group>

        <Group justify="space-between">
          <Text inherit>Contact:</Text>
          <Text inherit fw={500}>
            {props.customerPhone}
          </Text>
        </Group>

        <Divider variant="dashed" />

        <Group justify="space-between">
          <Text inherit>Type</Text>
          <BadgeOrderType props={props} />
        </Group>

        {/* <Group justify="space-between">
          <Text inherit>Status</Text>
          <BadgeStatus props={{ status: props.orderStatus }} />
        </Group> */}

        <Divider variant="dashed" />

        <Group justify="space-between" fz={'lg'}>
          <Text inherit c={'sec'} fw={500}>
            Total:
          </Text>

          <Text inherit>
            Kshs.{' '}
            <Text component="span" inherit fz={'xl'} fw={500} c={'ter'}>
              <NumberFormatter value={getSum()} />
            </Text>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
