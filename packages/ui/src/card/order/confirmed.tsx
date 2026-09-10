import React from 'react';
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
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { StoreGet } from '@repo/constants';
import { OrderGet } from '@repo/types';
import { getRegionalDate } from '@repo/utils';
import { capitalizeWords } from '@repo/utils';
import { IconCheck, IconCopy } from '@tabler/icons-react';

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
  const copyProps = { icon: clipboard.copied ? IconCheck : IconCopy };

  return (
    <Card bg={'var(--mantine-color-dark-8)'} p={{ base: 'md', md: 'xl' }} {...restProps}>
      <Stack gap={'xs'}>
        <Group justify="space-between">
          <Title order={3} fz={'sm'} fw={500}>
            Tracking Code
          </Title>

          <Group wrap="nowrap">
            <Text ta={'end'} fz={'sm'} visibleFrom="xs">
              {order?.trackingCode}
            </Text>

            <Tooltip label={clipboard.copied ? 'Coppied' : 'Copy Code'} visibleFrom="xs">
              <ActionIcon
                size={ICON_WRAPPER_SIZE - 4}
                color={clipboard.copied ? 'ter' : 'gray'}
                onClick={() => {
                  clipboard.copy(order?.trackingCode);
                }}
                visibleFrom="xs"
              >
                <copyProps.icon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>

            <Button
              size="xs"
              color={clipboard.copied ? 'ter' : 'gray'}
              onClick={() => {
                clipboard.copy(order?.trackingCode);
              }}
              hiddenFrom="xs"
              leftSection={<IconCopy size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
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
            {(order?.fulfillmentType || '').toUpperCase()}
          </Text>
        </Group>

        <Divider variant="dashed" />

        <Group justify="space-between" wrap="nowrap">
          <Title order={3} fz={'sm'} fw={500}>
            Payment Option
          </Title>
          <Badge ta={'end'} color="gray">
            {order?.paymentMethod}
          </Badge>
        </Group>

        <Divider variant="dashed" />

        <Group justify="space-between" wrap="nowrap">
          <Title order={3} fz={'sm'} fw={500}>
            Name
          </Title>

          <Text ta={'end'} fz={'sm'}>
            {capitalizeWords(order?.customerName || '')}
          </Text>
        </Group>

        <Divider variant="dashed" />

        <Group justify="space-between" wrap="nowrap">
          <Title order={3} fz={'sm'} fw={500}>
            Phone
          </Title>

          <Text ta={'end'} fz={'sm'}>
            {order?.customerPhone}
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
            {getRegionalDate(order?.createdAt || new Date()).date}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
