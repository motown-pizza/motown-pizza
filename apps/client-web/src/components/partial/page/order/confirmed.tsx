'use client';

import React, { useEffect, useState } from 'react';
import LayoutSection from '@repo/components/layout/section';
import IntroSection from '@repo/components/layout/intros/section';
import { useStoreOrder } from '@/libraries/zustand/stores/order';
import { getUrlParam } from '@repo/utilities/url';
import { PARAM_NAME } from '@repo/constants/names';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { capitalizeWords } from '@repo/utilities/string';
import { useClipboard } from '@mantine/hooks';
import { OrderRelations } from '@repo/types/models/order';
import { stores } from '@/data/stores';
import { StoreGet } from '@repo/types/models/store';
import NextLink from '@repo/components/common/anchor/next-link';

export default function Confirmed() {
  const clipboard = useClipboard({ timeout: 500 });
  const { orders } = useStoreOrder();

  const [order, setOrder] = useState<OrderRelations | null>(null);
  const [store, setStore] = useState<StoreGet | null>(null);

  useEffect(() => {
    if (orders === undefined) return;
    if (!orders) return;

    const orderConfirmedId = getUrlParam(PARAM_NAME.ORDER_CONFIRMED);
    const orderItem = orders?.find((o) => o.id == orderConfirmedId);
    console.log('orderItem', orderItem);

    if (orderItem) {
      setOrder(orderItem);

      // const orderItem = (orders || [])[0];
      const storeItem = stores.find((s) => s.id == orderItem?.store_id);
      if (storeItem) setStore(storeItem);
    }
  }, [orders]);

  return (
    <LayoutSection
      id="page-checkout-review-content"
      padded={SECTION_SPACING * 2}
      containerized={'xs'}
    >
      <Stack>
        <Group justify="center">
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="green" radius={999}>
            <IconCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        </Group>

        <IntroSection
          props={{
            title: 'Order Confirmed',
            desc: 'Your order has been confirmed. We will contact you shortly.',
          }}
        />

        {order && (
          <Stack gap={'xl'} mt={SECTION_SPACING}>
            <Card bg={'var(--mantine-color-dark-8)'} padding={'xl'}>
              <Stack gap={'xs'}>
                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Order Id
                  </Title>

                  <Group>
                    <Text ta={'end'} fw={500} fz={'sm'}>
                      {order?.id}
                    </Text>

                    <Tooltip label={clipboard.copied ? 'Coppied' : 'Copy Id'}>
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE - 4}
                        color={clipboard.copied ? 'green' : 'dark'}
                        onClick={() => {
                          clipboard.copy(order.id);
                        }}
                      >
                        <IconCopy
                          size={ICON_SIZE - 4}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Type
                  </Title>
                  <Text ta={'end'} fw={500} fz={'sm'}>
                    {capitalizeWords(order?.type || '')}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Payment Option
                  </Title>
                  <Badge ta={'end'} fw={500} color="dark">
                    {order?.payment_option}
                  </Badge>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Name
                  </Title>

                  <Text ta={'end'} fw={500} fz={'sm'}>
                    {capitalizeWords(order?.name || '')}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Email
                  </Title>

                  <Text ta={'end'} fw={500} fz={'sm'}>
                    {order?.email}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Phone
                  </Title>

                  <Text ta={'end'} fw={500} fz={'sm'}>
                    {order?.phone}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={'normal'}>
                    Store
                  </Title>

                  <Text ta={'end'} fw={500} fz={'sm'}>
                    {`${store?.title}, ${store?.location}`}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Stack gap={'xs'}>
              <Text inherit ta={'center'}>
                You can track your order
              </Text>

              <Group justify="center">
                <NextLink href={`/order/track?orderId=${order.id}`}>
                  <Button>Track Order</Button>
                </NextLink>
              </Group>
            </Stack>
          </Stack>
        )}
      </Stack>
    </LayoutSection>
  );
}
