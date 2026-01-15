'use client';

import React, { useEffect, useState } from 'react';
import LayoutSection from '@repo/components/layout/section';
import IntroSection from '@repo/components/layout/intros/section';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
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
import { OrderGet } from '@repo/types/models/order';
import { stores } from '@/data/stores';
import { StoreGet } from '@repo/types/models/store';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { OrderFulfilmentType } from '@repo/types/models/enums';

export default function Confirmed() {
  const clipboard = useClipboard({ timeout: 1000 });
  const { orders } = useStoreOrder();
  const { deliveries } = useStoreDelivery();

  const [order, setOrder] = useState<OrderGet | null>(null);
  const [store, setStore] = useState<StoreGet | null>(null);

  const delivery = deliveries?.find((d) => d.order_id == order?.id);

  useEffect(() => {
    if (orders === undefined) return;
    if (!orders) return;

    const orderID = getUrlParam(PARAM_NAME.ORDER_CONFIRMED);
    const orderItem = orders?.find((o) => o.id == orderID);

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
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="ter.6" radius={999}>
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
            <Card
              bg={'var(--mantine-color-dark-8)'}
              p={{ base: 'md', md: 'xl' }}
            >
              <Stack gap={'xs'}>
                <Group justify="space-between">
                  <Title order={3} fz={'sm'} fw={500}>
                    Tracking Code
                  </Title>

                  <Group wrap="nowrap">
                    <Text ta={'end'} fz={'sm'} visibleFrom="xs">
                      {order?.tracking_code}
                    </Text>

                    <Tooltip
                      label={clipboard.copied ? 'Coppied' : 'Copy Code'}
                      visibleFrom="xs"
                    >
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE - 4}
                        color={clipboard.copied ? 'ter.6' : 'dark'}
                        onClick={() => {
                          clipboard.copy(order.tracking_code);
                        }}
                        visibleFrom="xs"
                      >
                        <IconCopy
                          size={ICON_SIZE - 4}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ActionIcon>
                    </Tooltip>

                    <Button
                      size="xs"
                      color={clipboard.copied ? 'ter.6' : 'dark'}
                      onClick={() => {
                        clipboard.copy(order.tracking_code);
                      }}
                      hiddenFrom="xs"
                      leftSection={
                        <IconCopy
                          size={ICON_SIZE - 4}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      }
                    >
                      {clipboard.copied ? 'Coppied' : 'Copy Code'}
                    </Button>
                  </Group>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between" wrap="nowrap">
                  <Title order={3} fz={'sm'} fw={500}>
                    Fulfilment Type
                  </Title>
                  <Text ta={'end'} fz={'sm'}>
                    {capitalizeWords(order?.fulfillment_type || '')}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between" wrap="nowrap">
                  <Title order={3} fz={'sm'} fw={500}>
                    Payment Option
                  </Title>
                  <Badge ta={'end'} color="dark">
                    {order?.payment_method}
                  </Badge>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between" wrap="nowrap">
                  <Title order={3} fz={'sm'} fw={500}>
                    Name
                  </Title>

                  <Text ta={'end'} fz={'sm'}>
                    {capitalizeWords(order?.customer_name || '')}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between" wrap="nowrap">
                  <Title order={3} fz={'sm'} fw={500}>
                    Phone
                  </Title>

                  <Text ta={'end'} fz={'sm'}>
                    {order?.customer_phone}
                  </Text>
                </Group>

                <Divider variant="dashed" />

                <Group justify="space-between" wrap="nowrap">
                  <Title order={3} fz={'sm'} fw={500}>
                    Store
                  </Title>

                  <Text ta={'end'} fz={'sm'} lineClamp={1}>
                    {`${store?.title}, ${store?.location}`}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Stack ta={'center'}>
              <Title order={3} fz={'lg'}>
                Order Tracking
              </Title>

              {order.fulfillment_type == OrderFulfilmentType.DELIVERY &&
                delivery && (
                  <Stack gap={'xs'} fz={'sm'} c={'dimmed'}>
                    <Text inherit>
                      Your verification pin is{' '}
                      <Text component={'span'} inherit fw={'bold'} c={'sec'}>
                        {delivery.verfication_code}
                      </Text>
                      .
                    </Text>

                    <Text inherit>
                      It will be required to verify your identity when receiving
                      your delivery. This security feature exists to protect
                      orders (and customers) from theft. Don&apos;t share the
                      pin with anyone other than the delivery person.
                    </Text>
                  </Stack>
                )}

              <Group justify="center">
                <NextLink
                  href={`/order/track?trackingCode=${order.tracking_code}`}
                >
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
