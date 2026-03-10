'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
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
import { useFormOrder } from '@repo/hooks/form/order';
import { OrderFulfilmentType, OrderStatus } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';
import { OrderGet } from '@repo/types/models/order';
import Link from 'next/link';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { sortArray } from '@repo/utilities/array';
import { Order as EnumOrder } from '@repo/types/enums';
import CardOrderItem from '../../common/cards/order-item';

export default function Order({
  props,
}: {
  props?: {
    options?: { modal?: boolean; close?: () => void };
    defaultValues?: Partial<OrderGet>;
  };
}) {
  const { form, submitted, handleSubmit, withGuests, setWithGuests } =
    useFormOrder({
      defaultValues: props?.defaultValues,
    });

  const { orderItems } = useStoreOrderItem();

  const orderItemsCurrent = orderItems?.filter(
    (oi) => oi.order_id == props?.defaultValues?.id
  );

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())} noValidate>
      <Card bg={'var(--mantine-color-body)'} shadow="xs" pt={'xs'}>
        <Grid>
          <GridCol span={8}>
            <Grid>
              <GridCol span={12}>
                <Fieldset legend="Basic order details">
                  <Grid>
                    <GridCol span={{ base: 12, xs: 6 }}>
                      <TextInput
                        required
                        label={'Name'}
                        placeholder={`Your Name`}
                        {...form.getInputProps('customer_name')}
                      />
                    </GridCol>

                    <GridCol span={{ base: 12, xs: 6 }}>
                      <TextInput
                        required
                        label={'Phone'}
                        placeholder="Your Phone"
                        {...form.getInputProps('customer_phone')}
                      />
                    </GridCol>

                    <GridCol span={{ base: 12, xs: 6 }}>
                      <Select
                        required
                        label={'Fulfilment Type'}
                        allowDeselect={false}
                        checkIconPosition="right"
                        data={[
                          {
                            value: OrderFulfilmentType.DINE_IN,
                            label: capitalizeWords(OrderFulfilmentType.DINE_IN),
                          },
                          {
                            value: OrderFulfilmentType.COLLECTION,
                            label: capitalizeWords(
                              OrderFulfilmentType.COLLECTION
                            ),
                          },
                          {
                            value: OrderFulfilmentType.DELIVERY,
                            label: capitalizeWords(
                              OrderFulfilmentType.DELIVERY
                            ),
                          },
                        ]}
                        {...form.getInputProps('fulfillment_type')}
                      />
                    </GridCol>
                  </Grid>
                </Fieldset>
              </GridCol>

              {form.values.fulfillment_type == OrderFulfilmentType.DINE_IN && (
                <GridCol span={12}>
                  <Fieldset legend="Guest details">
                    <Grid>
                      <GridCol span={{ base: 12, xs: 6 }}>
                        <Box mih={60.8} mt={'xs'}>
                          <Checkbox
                            size="md"
                            label={'With guests'}
                            description={'Customer has guests'}
                            checked={withGuests}
                            onChange={(event) =>
                              setWithGuests(event.currentTarget.checked)
                            }
                          />
                        </Box>
                      </GridCol>

                      {withGuests && (
                        <GridCol span={{ base: 12, xs: 6 }}>
                          <Group>
                            <NumberInput
                              required
                              label={'Guest(s)'}
                              placeholder={`Your Guest(s)`}
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
                                    (form.values.guest_count || 0) > 1 &&
                                    form.setFieldValue(
                                      'guest_count',
                                      (form.values.guest_count || 0) - 1
                                    )
                                  }
                                >
                                  <IconMinus
                                    size={ICON_SIZE}
                                    stroke={ICON_STROKE_WIDTH}
                                  />
                                </ActionIcon>
                              }
                              rightSection={
                                <ActionIcon
                                  size={ICON_WRAPPER_SIZE}
                                  color="gray"
                                  variant="light"
                                  mr={10}
                                  onClick={() =>
                                    (form.values.guest_count || 0) < 10 &&
                                    form.setFieldValue(
                                      'guest_count',
                                      (form.values.guest_count || 0) + 1
                                    )
                                  }
                                >
                                  <IconPlus
                                    size={ICON_SIZE}
                                    stroke={ICON_STROKE_WIDTH}
                                  />
                                </ActionIcon>
                              }
                            />
                          </Group>
                        </GridCol>
                      )}
                    </Grid>
                  </Fieldset>
                </GridCol>
              )}

              {props?.defaultValues?.updated_at && (
                <GridCol span={12}>
                  <Fieldset legend="Order items">
                    <Grid>
                      <GridCol span={12}>
                        {orderItems === undefined ? (
                          <Center mih={100}>
                            <Loader size={'xs'} />
                          </Center>
                        ) : (
                          <Stack gap={0}>
                            {!orderItemsCurrent?.length ? (
                              <Stack align="center" mih={100} py={'xl'}>
                                <Text fz={'sm'} ta={'center'} c={'dimmed'}>
                                  No order items found.
                                </Text>
                              </Stack>
                            ) : (
                              <Stack gap={'xs'}>
                                {sortArray(
                                  orderItemsCurrent,
                                  (i) => i.created_at,
                                  EnumOrder.DESCENDING
                                ).map((oi, i) => (
                                  <div key={i}>
                                    <CardOrderItem props={oi} />
                                  </div>
                                ))}
                              </Stack>
                            )}
                          </Stack>
                        )}
                      </GridCol>
                    </Grid>
                  </Fieldset>
                </GridCol>
              )}
            </Grid>
          </GridCol>

          <GridCol span={4}>
            <Grid>
              <GridCol span={12}>
                <Fieldset legend="Order status">
                  <Select
                    name="order-status"
                    label="Select the order's current status"
                    required
                    checkIconPosition="right"
                    allowDeselect={false}
                    data={[
                      {
                        value: OrderStatus.DRAFT,
                        label: capitalizeWords(OrderStatus.DRAFT),
                      },
                      {
                        value: OrderStatus.PROCESSING,
                        label: capitalizeWords(OrderStatus.PROCESSING),
                      },
                      {
                        value: OrderStatus.PREPARING,
                        label: capitalizeWords(OrderStatus.PREPARING),
                      },
                      {
                        value: OrderStatus.OUT_FOR_DELIVERY,
                        label: capitalizeWords(OrderStatus.OUT_FOR_DELIVERY),
                      },
                      {
                        value: OrderStatus.COMPLETED,
                        label: capitalizeWords(OrderStatus.COMPLETED),
                      },
                    ]}
                    {...form.getInputProps('order_status')}
                  />
                </Fieldset>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group>
              <Button
                color="dark"
                loading={submitted}
                component={Link}
                href={`/dashboard/orders`}
              >
                Cancel
              </Button>

              <Group display={form.isDirty() ? undefined : 'none'}>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updated_at ? 'Save Draft' : 'Update'}
                </Button>
              </Group>
            </Group>
          </GridCol>
        </Grid>
      </Card>
    </form>
  );
}
