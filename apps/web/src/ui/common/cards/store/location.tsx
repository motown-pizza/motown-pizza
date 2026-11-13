'use client';

import {
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, StoreGet } from '@repo/constants';
import { stores } from '@repo/constants';
import React, { useState } from 'react';
import { useOrderStart } from '@repo/hooks';
import { OrderFulfilmentType } from '@repo/types';
import { IconMapPin, IconPhone } from '@tabler/icons-react';

export default function CardStore({
  props,
  type,
  index,
  setAction,
}: {
  props: StoreGet & { distanceKm?: number };
  type?: OrderFulfilmentType;
  index: number;
  setAction?: any;
}) {
  const [loading, setLoading] = useState(false);
  const { handleStart } = useOrderStart({ storeId: props.id, stores });

  const action = () => {
    switch (type) {
      case OrderFulfilmentType.DELIVERY:
        return (
          <Stack gap={'xs'}>
            <Divider />

            <Group justify="space-between" mt="xs" wrap="nowrap">
              <Text c="green" fz="xs" fw={500}>
                Open now
              </Text>
              <Text c="dimmed" fz="xs">
                Delivery in 30 to 45 min
              </Text>
            </Group>

            <Group mt={'xs'}>
              <Button
                size="xs"
                loading={loading}
                onClick={() => {
                  setLoading(true);

                  setTimeout(() => {
                    handleStart({
                      fulfillmentType: OrderFulfilmentType.DELIVERY,
                    });
                  }, 500);
                }}
              >
                Select
              </Button>
            </Group>
          </Stack>
        );

      case OrderFulfilmentType.COLLECTION:
        return (
          <Stack gap={'xs'}>
            <Divider />

            <Group justify="space-between" mt="xs" wrap="nowrap">
              <Text c="green" fz="xs" fw={500}>
                Open now
              </Text>
              <Text c="dimmed" fz="xs">
                Collection in 15 min
              </Text>
            </Group>

            <Group mt={'xs'}>
              <Button
                size="xs"
                loading={loading}
                onClick={() => {
                  setLoading(true);

                  setTimeout(() => {
                    handleStart({
                      fulfillmentType: OrderFulfilmentType.COLLECTION,
                    });
                  }, 500);
                }}
              >
                Select
              </Button>
            </Group>
          </Stack>
        );

      default:
        return !setAction ? null : (
          <Group justify="end">
            <Button size="xs" loading={loading} onClick={setAction}>
              Select
            </Button>
          </Group>
        );
    }
  };

  const actionComponent = action();

  return (
    <Card key={props.id} bg={'var(--mantine-color-dark-8)'} withBorder>
      <Stack ta={'start'} gap={0}>
        <div>
          <Title order={3} fz={'md'} c={'var(--mantine-color-white)'}>
            {/* {'MoTown'}  */}
            {props.title}
          </Title>

          <Stack fz={'sm'} gap={0} mt={5} c={'dark.1'}>
            <Group gap={5}>
              <Box c={'ter'}>
                <IconMapPin size={ICON_SIZE - 4} stroke={2} />
              </Box>

              <Anchor inherit c={'inherit'} underline="hover" href={props.iframe} target="_blank">
                {props.location}
              </Anchor>
            </Group>

            <Group gap={5}>
              <Box c={'ter'}>
                <IconPhone size={ICON_SIZE - 4} stroke={2} />
              </Box>

              <Anchor inherit c={'inherit'} underline="hover" href={`tel:${props.phone}`}>
                {props.phone}
              </Anchor>
            </Group>
          </Stack>
        </div>

        {<Box mt={'xs'}>{actionComponent}</Box>}
      </Stack>
    </Card>
  );
}
