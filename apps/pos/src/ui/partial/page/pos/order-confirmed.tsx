'use client';

import React, { useEffect } from 'react';
import { Button, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { useStoreDelivery, useStoreOrder, useStoreOrderPlacement } from '@repo/store';
import { SECTION_SPACING, stores } from '@repo/constants';
import { getUrlParam } from '@repo/utils';
import { PARAM_NAME } from '@repo/constants';
import { CardOrderConfirmed } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconCheck } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { OrderFulfilmentType } from '@repo/types';

export default function Orders() {
  const { orders } = useStoreOrder();

  // 1. Next.js hook for query params
  const searchParams = useSearchParams();
  const orderID = searchParams.get(PARAM_NAME.ORDER_CONFIRMED);

  // 2. Derive items during render (handling potential string vs number type mismatch)
  const orderItem =
    orders && orderID ? orders.find((o) => String(o.id) === String(orderID)) : undefined;
  const storeItem = orderItem
    ? stores.find((s) => String(s.id) === String(orderItem.storeId))
    : undefined;

  // const orderDetails = useStoreOrderPlacement((s) => s.orderDetails);

  const { deliveries } = useStoreDelivery();
  const delivery = deliveries?.find((di) => di.orderId == orderItem?.id);

  const clearOrderDetails = useStoreOrderPlacement((s) => s.clearOrderDetails);

  useEffect(() => {
    clearOrderDetails();
  }, []);

  return (
    <LayoutSection id={'order-confirmed'} containerized={'xs'} padded={'xl'} pb={SECTION_SPACING}>
      <Stack gap={'xl'}>
        <Group justify="center">
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="ter" radius={999}>
            <IconCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        </Group>

        <LayoutIntroSection
          props={{
            title: 'Order Confirmed',
            desc: 'Order has been placed and sent to the kitchen.',
          }}
        />

        {orderItem && (
          <>
            <CardOrderConfirmed
              props={{ order: orderItem, store: storeItem || null }}
              bg={'var(--mantine-color-dark-9)'}
            />

            {delivery && (
              <>
                <Stack gap={'xl'} c={'dimmed'} ta={'center'}>
                  <Text inherit fz={'xl'}>
                    Your verification pin is{' '}
                    <Text component={'span'} inherit fw={'bold'} c={'sec'}>
                      {delivery.verficationCode}
                    </Text>
                    .
                  </Text>

                  {orderItem.fulfillmentType == OrderFulfilmentType.DELIVERY && (
                    <Text inherit>
                      Share this with the customer. They will need it to verify their identity when
                      receiving their order from the delivery person. This security feature exists
                      to protect orders (and customers) from theft. Don&apos;t share the pin with
                      anyone other than the customer.
                    </Text>
                  )}

                  {orderItem.fulfillmentType == OrderFulfilmentType.DINE_IN && (
                    <Text inherit>
                      Share this with the customer. They will need it to verify their identity when
                      receiving their order. This security feature exists to protect orders (and
                      customers) from theft. Don&apos;t share the pin with anyone other than the
                      customer and the person who will bring the order to the customer&apos;s table.
                    </Text>
                  )}
                </Stack>
              </>
            )}
          </>
        )}
      </Stack>
    </LayoutSection>
  );
}
