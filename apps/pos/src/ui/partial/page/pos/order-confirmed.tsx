'use client';

import React from 'react';
import { Button, Group, Stack, ThemeIcon } from '@mantine/core';
import { useStoreOrder } from '@repo/store';
import { stores } from '@repo/constants';
import { getUrlParam } from '@repo/utils';
import { PARAM_NAME } from '@repo/constants';
import { CardOrderConfirmed } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconCheck } from '@tabler/icons-react';

export default function Orders() {
  const { orders } = useStoreOrder();

  // 1. Derive the order ID from the URL
  const orderID = getUrlParam(PARAM_NAME.ORDER_CONFIRMED);

  // 2. Derive the order and store items directly during render
  const orderItem = orders && orderID ? orders.find((o) => o.id == orderID) : undefined;
  const storeItem = orderItem ? stores.find((s) => s.id == orderItem.storeId) : undefined;

  // You can now use `orderItem` and `storeItem` directly in your markup!

  return (
    <LayoutSection id={'order-confirmed'} containerized={'xs'} padded={'xl'}>
      <Stack>
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

            <Group justify="center">
              <Button
                color="blue"
                // loading={loadingCancel}
                // onClick={handleCancelOrder}
              >
                Print Recipt
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </LayoutSection>
  );
}
