'use client';

import React, { useEffect, useState } from 'react';
import { Button, Group, Stack, ThemeIcon } from '@mantine/core';
import { useStoreOrder } from '@repo/store';
import { StoreGet, stores } from '@repo/constants';
import { getUrlParam } from '@repo/utils';
import { PARAM_NAME } from '@repo/constants';
import { OrderGet } from '@repo/types';
import { CardOrderConfirmed } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconCheck } from '@tabler/icons-react';

export default function Orders() {
  const { orders } = useStoreOrder();

  const [order, setOrder] = useState<OrderGet | null>(null);
  const [store, setStore] = useState<StoreGet | null>(null);

  useEffect(() => {
    if (orders === undefined) return;
    if (!orders) return;

    const handleSetOrder = () => {
      const orderID = getUrlParam(PARAM_NAME.ORDER_CONFIRMED);
      const orderItem = orders?.find((o) => o.id == orderID);

      if (orderItem) {
        setOrder(orderItem);

        // const orderItem = (orders || [])[0];
        const storeItem = stores.find((s) => s.id == orderItem?.storeId);
        if (storeItem) setStore(storeItem);
      }
    };

    handleSetOrder();
  }, [orders]);

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

        {order && (
          <>
            <CardOrderConfirmed props={{ order, store }} bg={'var(--mantine-color-dark-9)'} />

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
