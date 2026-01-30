import {
  ActionIcon,
  Badge,
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
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { StoreGet } from '@repo/constants/stores';
import { OrderGet } from '@repo/types/models/order';
import { getRegionalDate } from '@repo/utilities/date-time';
import { capitalizeWords } from '@repo/utilities/string';
import { IconCopy } from '@tabler/icons-react';
import React from 'react';

export default function Confirmed({
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
    <Card
      bg={'var(--mantine-color-dark-8)'}
      p={{ base: 'md', md: 'xl' }}
      {...restProps}
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
                  clipboard.copy(order?.tracking_code);
                }}
                visibleFrom="xs"
              >
                <IconCopy size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>

            <Button
              size="xs"
              color={clipboard.copied ? 'ter.6' : 'dark'}
              onClick={() => {
                clipboard.copy(order?.tracking_code);
              }}
              hiddenFrom="xs"
              leftSection={
                <IconCopy size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
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
            {(order?.fulfillment_type || '').toUpperCase()}
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

        <Divider variant="dashed" />

        <Group justify="space-between" wrap="nowrap">
          <Title order={3} fz={'sm'} fw={500}>
            Created
          </Title>

          <Text ta={'end'} fz={'sm'} lineClamp={1}>
            {getRegionalDate(order?.created_at || new Date()).date}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
