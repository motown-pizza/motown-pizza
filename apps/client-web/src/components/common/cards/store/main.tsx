import React, { useRef } from 'react';
import { Box, Button, Card, Group, Stack, Text } from '@mantine/core';
import { IconBuildingStore, IconMapPin, IconPhone } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { defaultOrderDetails } from '@/data/orders';
import { useRouter } from 'next/navigation';
import { StoreGet } from '@repo/constants/stores';
import { useOrderActions } from '@repo/hooks/actions/order';
import { generateUUID } from '@repo/utilities/generators';
import { SyncStatus } from '@repo/types/models/enums';
import { stores } from '@repo/constants/stores';

export default function Main({ props }: { props: StoreGet }) {
  const orderIdRef = useRef(generateUUID());
  const router = useRouter();

  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  return (
    <Card bg={'var(--mantine-color-dark-6)'}>
      <Box
        component="iframe"
        src={props.iframe}
        loading="lazy"
        w={'100%'}
        h={{ base: 240, md: 280 }}
        style={{ border: 0, borderRadius: 'var(--mantine-radius-lg)' }}
        // allowfullscreen=""
        // referrerpolicy="no-referrer-when-downgrade"
      ></Box>

      <Stack gap={5} fz={'sm'} mt={'md'}>
        <Group gap={5}>
          <IconBuildingStore size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          <Text inherit>{props.title}</Text>
        </Group>

        <Group gap={5}>
          <IconMapPin size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          <Text inherit>{props.location}</Text>
        </Group>

        <Group gap={5}>
          <IconPhone size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          <Text inherit>{props.phone}</Text>
        </Group>
      </Stack>

      <Group justify="end">
        <Button
          onClick={async () => {
            const orderObject = {
              ...(orderDetails || defaultOrderDetails),
              store_id: props.id,
              id: orderIdRef.current,
              sync_status: SyncStatus.PENDING,
            };

            const newOrder = await orderCreate(orderObject, { stores });
            setOrderDetails({ ...orderObject, ...newOrder });

            router.push('/order/select-menu?menuTab=pizzas');
          }}
        >
          Select Store
        </Button>
      </Group>
    </Card>
  );
}
