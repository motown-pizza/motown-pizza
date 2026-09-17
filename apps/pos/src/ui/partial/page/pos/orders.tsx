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
import CardOrder from '@pos/ui/common/cards/order';
import { useStoreOrder } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { OrderFulfilmentType, OrderStatus } from '@repo/types';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { IconArrowLeft, IconMoodPuzzled } from '@tabler/icons-react';
import { AnchorNextLink } from '@repo/ui';

export default function Orders() {
  const [currentType, setCurrentStatus] = useState<OrderFulfilmentType | string>('All');

  const { orders } = useStoreOrder();
  const filteredOrders = orders?.filter((oi) => oi.orderStatus != OrderStatus.PROCESSING);

  const filteredOrdersTab =
    currentType == 'All'
      ? filteredOrders
      : filteredOrders?.filter((oi) => oi.fulfillmentType == currentType);

  return (
    <div>
      <Group
        justify="space-between"
        pos={'sticky'}
        top={0}
        py={'lg'}
        style={{
          backgroundColor: 'var(--mantine-color-dark-9)',
          zIndex: 1,
        }}
      >
        <Group>
          <AnchorNextLink href={'/pos'}>
            <Group>
              <ActionIcon size={ICON_WRAPPER_SIZE}>
                <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </AnchorNextLink>

          <Title order={2}>Orders</Title>
        </Group>

        <Group justify="end" gap={'xs'}>
          {orderStatuses.map((s, i) => (
            <Button
              key={i}
              size="xs"
              color={currentType === s ? 'pri' : 'gray'}
              // variant="light"
              onClick={() => setCurrentStatus(s)}
            >
              {capitalizeWords(s.replaceAll('_', ' '))}
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
      ) : !filteredOrdersTab?.length ? (
        <Stack align="center" py={SECTION_SPACING * 2} fz={'sm'} c={'dimmed'} ta={'center'}>
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} variant="light" radius={99}>
            <IconMoodPuzzled size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>

          <Stack align="center" ta={'center'} gap={0}>
            <Text inherit>
              No orders with the fulfilment type &apos;
              {capitalizeWords(currentType.replaceAll('_', ' '))}&apos; found.
            </Text>

            <Text inherit maw={320} mt={'xs'}>
              Orders with this status will appear here automatically.
            </Text>
          </Stack>
        </Stack>
      ) : (
        <Grid pb={'lg'}>
          {filteredOrdersTab.map((oi) => (
            <GridCol key={oi.id} span={4}>
              <CardOrder props={oi} />
            </GridCol>
          ))}
        </Grid>
      )}
    </div>
  );
}

const orderStatuses = [
  'All',
  OrderFulfilmentType.DINE_IN,
  OrderFulfilmentType.COLLECTION,
  OrderFulfilmentType.DELIVERY,
];
