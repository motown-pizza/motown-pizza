import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  CardProps,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { StoreGet } from '@repo/constants';
import { OrderGet } from '@repo/types';
import { getRegionalDate } from '@repo/utils';
import { capitalizeWords } from '@repo/utils';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { ButtonCopy } from '../../button/copy';

export function CardOrderConfirmed({
  props,
  ...restProps
}: {
  props: {
    order: OrderGet | null;
    store: StoreGet | null;
  };
} & CardProps) {
  const { order, store } = props;
  const clipboard = useClipboard({ timeout: 1000 });

  return (
    <Card bg={'var(--mantine-color-dark-9)'} withBorder p={{ base: 'md', md: 'xl' }} {...restProps}>
      <Stack gap={'xs'}>
        {order?.trackingCode && (
          <>
            <Group justify="space-between" align="end">
              <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
                Tracking Code
              </Title>

              <Group wrap="nowrap" gap={'xs'}>
                <Text ta={'end'} fz={'md'} fw={500} visibleFrom="xs">
                  {order.trackingCode}
                </Text>

                <Box visibleFrom="xs">
                  <ButtonCopy clipboardItem={order.trackingCode} />
                </Box>

                <Button
                  size="xs"
                  color={clipboard.copied ? 'ter' : 'blue'}
                  onClick={() => {
                    clipboard.copy(order.trackingCode);
                  }}
                  hiddenFrom="xs"
                  leftSection={<IconCopy size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
                >
                  {clipboard.copied ? 'Coppied' : 'Copy Code'}
                </Button>
              </Group>
            </Group>

            <Divider variant="dashed" color="dark.4" />
          </>
        )}

        <Group justify="space-between" wrap="nowrap" align="end">
          <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
            Fulfilment Type
          </Title>

          <Text ta={'end'} fz={'md'} fw={500}>
            {capitalizeWords((order?.fulfillmentType || '').toLowerCase().replaceAll('_', ' '))}
          </Text>
        </Group>

        <Divider variant="dashed" color="dark.4" />

        <Group justify="space-between" wrap="nowrap" align="end">
          <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
            Payment Option
          </Title>

          <Badge ta={'end'} color="blue">
            {order?.paymentMethod}
          </Badge>
        </Group>

        <Divider variant="dashed" color="dark.4" />

        <Group justify="space-between" wrap="nowrap" align="end">
          <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
            Name
          </Title>

          <Text ta={'end'} fz={'md'} fw={500}>
            {capitalizeWords(order?.customerName || '')}
          </Text>
        </Group>

        <Divider variant="dashed" color="dark.4" />

        <Group justify="space-between" wrap="nowrap" align="end">
          <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
            Phone
          </Title>

          <Text ta={'end'} fz={'md'} fw={500}>
            {order?.customerPhone}
          </Text>
        </Group>

        <Divider variant="dashed" color="dark.4" />

        <Group justify="space-between" wrap="nowrap" align="end">
          <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
            Store
          </Title>

          <Text ta={'end'} fz={'md'} fw={500} lineClamp={1}>
            {`${store?.title}, ${store?.location}`}
          </Text>
        </Group>

        <Divider variant="dashed" color="dark.4" />

        <Group justify="space-between" wrap="nowrap" align="end">
          <Title order={3} fz={'sm'} fw={'normal'} c={'sec'}>
            Created
          </Title>

          <Text ta={'end'} fz={'md'} fw={500} lineClamp={1}>
            {getRegionalDate(order?.createdAt || new Date()).date}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
