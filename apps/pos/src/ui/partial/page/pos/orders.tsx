'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Button,
  Divider,
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
import { useStoreCartItem, useStoreDelivery, useStoreOrder, useStoreOrderItem } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { OrderFulfilmentType, OrderGet, OrderStatus, SyncStatus } from '@repo/types';
import {
  getClientApiUrl,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
  STORE_NAME,
} from '@repo/constants';
import { IconArrowLeft, IconMoodPuzzled, IconRefresh } from '@tabler/icons-react';
import { AnchorNextLink } from '@repo/ui';
import { cartItemsGet, deliveriesGet, orderItemsGet, ordersGet } from '@repo/handlers';

export default function Orders() {
  const [currentType, setCurrentStatus] = useState<OrderFulfilmentType | string>('All');

  const orders = useStoreOrder((s) => s.orders);

  const filteredOrders = orders?.filter((oi) => oi.orderStatus != OrderStatus.PROCESSING);

  const filteredOrdersTab =
    currentType == 'All'
      ? filteredOrders
      : filteredOrders?.filter((oi) => oi.fulfillmentType == currentType);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);

    // 1. Access your Zustand state getters/setters
    const orders = useStoreOrder.getState().orders;
    const setOrders = useStoreOrder.getState().setOrders;

    const orderItems = useStoreOrderItem.getState().orderItems;
    const setOrderItems = useStoreOrderItem.getState().setOrderItems;

    const cartItems = useStoreCartItem.getState().cartItems;
    const setCartItems = useStoreCartItem.getState().setCartItems;

    const deliveries = useStoreDelivery.getState().deliveries;
    const setDeliveries = useStoreDelivery.getState().setDeliveries;

    // 2. Define the configuration map
    const syncConfigs: StoreSyncConfig<any>[] = [
      {
        name: STORE_NAME.ORDERS,
        fetchFn: () => ordersGet({ sourceSite: 'pos', apiUrl: getClientApiUrl() }),
        getStoreItems: () => orders || [],
        setStoreItems: setOrders,
      },
      {
        name: STORE_NAME.ORDER_ITEMS,
        fetchFn: () => orderItemsGet({ sourceSite: 'pos', apiUrl: getClientApiUrl() }),
        getStoreItems: () => orderItems || [],
        setStoreItems: setOrderItems,
      },
      {
        name: STORE_NAME.CART_ITEMS,
        fetchFn: () => cartItemsGet({ sourceSite: 'pos', apiUrl: getClientApiUrl() }),
        getStoreItems: () => cartItems || [],
        setStoreItems: setCartItems,
      },
      {
        name: STORE_NAME.DELIVERIES,
        fetchFn: () => deliveriesGet({ sourceSite: 'pos', apiUrl: getClientApiUrl() }),
        getStoreItems: () => deliveries || [],
        setStoreItems: setDeliveries,
      },
    ];

    try {
      // 3. Run all store diffs concurrently
      const results = await Promise.allSettled(
        syncConfigs.map((config) => syncStoreEntity(config)),
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to sync ${syncConfigs[index].name}:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Fatal sync error:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
          <Group>
            <Button
              size="xs"
              color={'sec'}
              c={'dark.9'}
              leftSection={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
              loading={refreshing}
              // variant="light"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Group>

          <Divider orientation="vertical" h={24} my={'auto'} mx={'xs'} color="gray" />

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
            {currentType !== 'All' && (
              <Text inherit>
                No orders with the fulfilment type &apos;
                {capitalizeWords(currentType.replaceAll('_', ' '))}&apos; found.
              </Text>
            )}

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

// Constraint ensuring the entity has the required diff fields
export interface SyncableEntity {
  id: string;
  updatedAt: Date | string;
  syncStatus?: SyncStatus | string;
}

// Config object for each entity/store
export interface StoreSyncConfig<T extends SyncableEntity> {
  name: string;
  fetchFn: () => Promise<{ items: T[] }>;
  getStoreItems: () => T[];
  setStoreItems: (items: T[]) => void;
  // Optional transform if a model needs custom syncStatus logic on save
  transformIncoming?: (items: T[]) => T[];
}

export async function syncStoreEntity<T extends SyncableEntity>(
  config: StoreSyncConfig<T>,
): Promise<boolean> {
  const { fetchFn, getStoreItems, setStoreItems, transformIncoming } = config;

  const { items } = await fetchFn();
  const currentStoreItems = getStoreItems() ?? [];

  // 1. Filter out deleted remote records
  const filteredDeletions = items.filter((item) => item.syncStatus !== 'DELETED');

  let updateNeeded = false;

  // 2. Length check
  if (filteredDeletions.length !== currentStoreItems.length) {
    updateNeeded = true;
  } else {
    // 3. Map store items for O(1) comparison
    const storeMap = new Map(currentStoreItems.map((item) => [item.id, item]));

    updateNeeded = filteredDeletions.some((incomingItem) => {
      const existingItem = storeMap.get(incomingItem.id);
      if (!existingItem) return true;

      const incomingTime = new Date(incomingItem.updatedAt).getTime();
      const existingTime = new Date(existingItem.updatedAt).getTime();

      return incomingTime > existingTime;
    });
  }

  // 4. Batch update store if changed
  if (updateNeeded) {
    const finalItems = transformIncoming
      ? transformIncoming(filteredDeletions)
      : filteredDeletions.map((item) => ({
          ...item,
          syncStatus: SyncStatus.PENDING,
        }));

    setStoreItems(finalItems);
  }

  return updateNeeded;
}
