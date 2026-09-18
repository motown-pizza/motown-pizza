'use client';

import React, { useEffect } from 'react';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import { useStoreOrder, useStoreSession } from '@repo/store';
import { PARAM_NAME } from '@repo/constants';
import { Button, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { IconCheck } from '@tabler/icons-react';
import { stores } from '@repo/constants';
import { AnchorNextLink } from '@repo/ui';
import { useStoreDelivery } from '@repo/store';
import { OrderFulfilmentType } from '@repo/types';
import { CardOrderConfirmed } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Confirmed() {
  const { orders } = useStoreOrder();
  const { deliveries } = useStoreDelivery();

  const session = useStoreSession((s) => s.session);

  const searchParams = useSearchParams();

  const orderID = searchParams.get(PARAM_NAME.ORDER_CONFIRMED);

  const router = useRouter();

  useEffect(() => {
    if (!orderID) {
      router.replace('/');
    }
  }, []);

  const order = orders?.find((o) => o.id === orderID) ?? null;

  const store = order ? (stores.find((s) => s.id === order.storeId) ?? null) : null;

  const delivery = deliveries?.find((d) => d.orderId === order?.id);

  return (
    <LayoutSection
      id="page-checkout-review-content"
      padded={SECTION_SPACING * 2}
      containerized={'xs'}
    >
      <Stack>
        <Group justify="center" mb={'xl'}>
          <ThemeIcon size={ICON_WRAPPER_SIZE * 4} color="ter" radius={999}>
            <IconCheck size={ICON_SIZE * 4} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        </Group>

        <LayoutIntroSection
          props={{
            title: 'Order Confirmed',
            desc: 'Your order has been confirmed. We will contact you shortly.',
          }}
        />

        {order && (
          <Stack gap={SECTION_SPACING} mt={SECTION_SPACING}>
            <CardOrderConfirmed props={{ order, store }} />

            <Stack ta={'center'} gap={'xl'}>
              <Title order={3}>Order Tracking</Title>

              {order.fulfillmentType == OrderFulfilmentType.DELIVERY && delivery && (
                <Stack gap={'xl'} c={'dimmed'}>
                  <Text inherit fz={'xl'}>
                    Your verification pin is{' '}
                    <Text component={'span'} inherit fw={'bold'} c={'sec'}>
                      {delivery.verificationCode}
                    </Text>
                    .
                  </Text>

                  <Text inherit>
                    It will be required to verify your identity when receiving your order from the
                    delivery person. This security feature exists to protect orders (and customers)
                    from theft. Don&apos;t share the pin with anyone other than the delivery person.
                  </Text>
                </Stack>
              )}

              <Group justify="center">
                {/* <AnchorNextLink href={`/order/track?trackingCode=${order.trackingCode}`}>
                  <Button>Track Order</Button>
                </AnchorNextLink> */}

                {session?.email && (
                  <AnchorNextLink href={`/account/orders`}>
                    <Button color="sec" c={'dark.9'}>
                      View Orders
                    </Button>
                  </AnchorNextLink>
                )}
              </Group>
            </Stack>
          </Stack>
        )}
      </Stack>
    </LayoutSection>
  );
}
