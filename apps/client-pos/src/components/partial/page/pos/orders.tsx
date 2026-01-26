'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Button,
  Grid,
  GridCol,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import CardOrder from '@/components/common/cards/order';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { capitalizeWords } from '@repo/utilities/string';
import { OrderStatus } from '@repo/types/models/enums';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { IconArrowLeft, IconMoodPuzzled } from '@tabler/icons-react';
import NextLink from '@repo/components/common/anchor/next-link';

export default function Orders() {
  const [currentStatus, setCurrentStatus] = useState('All');

  const { orders } = useStoreOrder();
  const filteredOrders =
    currentStatus == 'All'
      ? orders
      : orders?.filter((oi) => oi.order_status == currentStatus);

  return (
    <Stack gap={'xl'}>
      <Group
        justify="space-between"
        pos={'sticky'}
        top={0}
        py={'lg'}
        style={{
          backgroundColor: 'var(--mantine-color-dark-8)',
          zIndex: 1,
        }}
      >
        <Group>
          <NextLink href={'/pos'}>
            <Group>
              <ActionIcon size={ICON_WRAPPER_SIZE}>
                <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </NextLink>

          <Title order={2}>Orders</Title>
        </Group>

        <Group justify="end" gap={'xs'}>
          {orderStatuses.map((s, i) => (
            <Button
              key={i}
              size="xs"
              color={currentStatus === s ? 'pri' : 'dark'}
              tt={'uppercase'}
              onClick={() => setCurrentStatus(s)}
            >
              {capitalizeWords(s)}
            </Button>
          ))}
        </Group>
      </Group>

      {orders === undefined ? (
        <Stack align="center" py={SECTION_SPACING * 3}>
          <Loader />
          <Text inherit fz={'sm'} c={'dimmed'}>
            Fetching client orders
          </Text>
        </Stack>
      ) : !filteredOrders?.length ? (
        <Stack
          align="center"
          py={SECTION_SPACING * 2}
          fz={'sm'}
          c={'dimmed'}
          ta={'center'}
        >
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} variant="light" radius={99}>
            <IconMoodPuzzled
              size={ICON_SIZE * 1.5}
              stroke={ICON_STROKE_WIDTH}
            />
          </ThemeIcon>

          <Stack align="center" ta={'center'} gap={0}>
            <Text inherit>
              No orders with the status &apos;{currentStatus}&apos; found.
            </Text>

            <Text inherit maw={320} mt={'xs'}>
              Orders with this status will appear here automatically.
            </Text>
          </Stack>
        </Stack>
      ) : (
        <Grid gutter={'xl'}>
          {filteredOrders.map((oi, i) => (
            <GridCol key={i} span={4}>
              <CardOrder props={oi} />
            </GridCol>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

const orderStatuses = [
  'All',
  OrderStatus.PROCESSING,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.COMPLETED,
];
