'use client';

import React, { useEffect, useState } from 'react';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import { useStoreOrder } from '@repo/store';
import { getUrlParam } from '@repo/utils';
import { PARAM_NAME } from '@repo/constants';
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
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { IconCheck } from '@tabler/icons-react';
import { OrderGet } from '@repo/types';
import { stores } from '@repo/constants';
import { StoreGet } from '@repo/constants';
import { AnchorNextLink } from '@repo/ui';
import { useStoreDelivery } from '@repo/store';
import { OrderFulfilmentType } from '@repo/types';
import { CardOrderConfirmed } from '@repo/ui';

export default function Confirmed() {
  const { orders } = useStoreOrder();
  const { deliveries } = useStoreDelivery();

  const [order, setOrder] = useState<OrderGet | null>(null);
  const [store, setStore] = useState<StoreGet | null>(null);

  const delivery = deliveries?.find((d) => d.orderId == order?.id);

  useEffect(() => {
    if (orders === undefined) return;
    if (!orders) return;

    const handleSetOrderAndStore = () => {
      const orderID = getUrlParam(PARAM_NAME.ORDER_CONFIRMED);
      const orderItem = orders?.find((o) => o.id == orderID);

      if (orderItem) {
        setOrder(orderItem);

        // const orderItem = (orders || [])[0];
        const storeItem = stores.find((s) => s.id == orderItem?.storeId);
        if (storeItem) setStore(storeItem);
      }
    };

    handleSetOrderAndStore();
  }, [orders]);

  return (
    <LayoutSection
      id="page-checkout-review-content"
      padded={SECTION_SPACING * 2}
      containerized={'xs'}
    >
      <Stack>
        <Group justify="center">
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="ter" radius={999}>
            <IconCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        </Group>

        <LayoutIntroSection
          props={{
            title: 'Order Confirmed',
            desc: 'Your order has been confirmed. We will contact you shortly.',
          }}
        />

        {order && (
          <Stack gap={'xl'} mt={SECTION_SPACING}>
            <CardOrderConfirmed props={{ order, store }} />

            <Stack ta={'center'}>
              <Title order={3} fz={'lg'}>
                Order Tracking
              </Title>

              {order.fulfillmentType == OrderFulfilmentType.DELIVERY && delivery && (
                <Stack gap={'xs'} fz={'sm'} c={'dimmed'}>
                  <Text inherit>
                    Your verification pin is{' '}
                    <Text component={'span'} inherit fw={'bold'} c={'sec'}>
                      {delivery.verficationCode}
                    </Text>
                    .
                  </Text>

                  <Text inherit>
                    It will be required to verify your identity when receiving your delivery. This
                    security feature exists to protect orders (and customers) from theft. Don&apos;t
                    share the pin with anyone other than the delivery person.
                  </Text>
                </Stack>
              )}

              <Group justify="center">
                <AnchorNextLink href={`/order/track?trackingCode=${order.trackingCode}`}>
                  <Button>Track Order</Button>
                </AnchorNextLink>
              </Group>
            </Stack>
          </Stack>
        )}
      </Stack>
    </LayoutSection>
  );
}
