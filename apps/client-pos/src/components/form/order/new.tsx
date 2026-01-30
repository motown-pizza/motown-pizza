'use client';

import React from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useStoreOrderPlacement } from '@repo/libraries/zustand/stores/order-placement';
import { useOrderActions } from '@repo/hooks/actions/order';
import { useFormOrderNew } from '@/hooks/form/order/new';
import { OrderFulfilmentType } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';

export default function New({
  options,
}: {
  options?: { modal?: boolean; close?: () => void };
}) {
  // const [loading, setLoading] = useState(false);

  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  const { form, handleSubmit } = useFormOrderNew({}, { close: options?.close });

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={12}>
          <TextInput
            required
            label={options?.modal ? undefined : 'Name'}
            aria-label={options?.modal ? 'Name' : undefined}
            placeholder={`Your Name${options?.modal ? ' *' : ''}`}
            {...form.getInputProps('name')}
          />
        </GridCol>

        <GridCol span={12}>
          <TextInput
            required
            label={options?.modal ? undefined : 'Phone'}
            aria-label={options?.modal ? 'Phone' : undefined}
            placeholder="Your Phone"
            {...form.getInputProps('phone')}
          />
        </GridCol>

        <GridCol span={12}>
          <Select
            required
            label={options?.modal ? undefined : 'Fulfilment Type'}
            aria-label={options?.modal ? 'Fulfilment Type' : undefined}
            allowDeselect={false}
            checkIconPosition="right"
            data={[
              {
                value: OrderFulfilmentType.DINE_IN,
                label: capitalizeWords(OrderFulfilmentType.DINE_IN),
              },
              {
                value: OrderFulfilmentType.COLLECTION,
                label: capitalizeWords(OrderFulfilmentType.COLLECTION),
              },
              {
                value: OrderFulfilmentType.DELIVERY,
                label: capitalizeWords(OrderFulfilmentType.DELIVERY),
              },
            ]}
            {...form.getInputProps('fulfillment_type')}
          />
        </GridCol>

        {form.values.fulfillment_type == OrderFulfilmentType.DINE_IN && (
          <GridCol span={6}>
            <Box mih={60.8} mt={'xs'}>
              <Checkbox
                size="md"
                label={options?.modal ? undefined : 'With guests'}
                aria-label={options?.modal ? 'With guests' : undefined}
                description={'Customer has guests'}
                defaultChecked={form.values.guests}
                {...form.getInputProps('guests')}
              />
            </Box>
          </GridCol>
        )}

        {form.values.guests && (
          <GridCol span={6}>
            <Group>
              <NumberInput
                required
                label={options?.modal ? undefined : 'Guest(s)'}
                aria-label={options?.modal ? 'Guest(s)' : undefined}
                placeholder={`Your Guest(s)${options?.modal ? ' *' : ''}`}
                {...form.getInputProps('guest_count')}
                styles={{ input: { paddingLeft: 40 } }}
                min={0}
                max={10}
                leftSection={
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE}
                    color="gray"
                    variant="light"
                    onClick={() =>
                      form.values.guest_count > 1 &&
                      form.setFieldValue(
                        'guest_count',
                        form.values.guest_count - 1
                      )
                    }
                  >
                    <IconMinus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                }
                rightSection={
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE}
                    color="gray"
                    variant="light"
                    mr={10}
                    onClick={() =>
                      form.values.guest_count < 10 &&
                      form.setFieldValue(
                        'guest_count',
                        form.values.guest_count + 1
                      )
                    }
                  >
                    <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                }
              />
            </Group>
          </GridCol>
        )}

        <GridCol span={12}>
          <Divider />

          <Box mt={'md'}>
            <Button type="submit" fullWidth>
              Create
            </Button>
          </Box>
        </GridCol>
      </Grid>
    </Box>
  );
}
