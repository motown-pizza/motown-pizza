'use client';

import React, { useEffect, useState } from 'react';
import { useFormIngredient } from '@repo/hooks';
import {
  Box,
  Button,
  Card,
  Divider,
  Fieldset,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import {
  IconContainer,
  IconLetterCase,
  IconMeterCube,
  IconStack,
  IconStack2,
  IconStack3,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IngredientGet } from '@repo/types';
import { useMediaQuery } from '@mantine/hooks';
import { capitalizeWords } from '@repo/utils';
import { MeasurementUnitType, Status } from '@repo/types';
import { useStockMovementActions } from '@repo/store';
import Link from 'next/link';

export function FormStoresIngredient({
  props,
}: {
  props?: {
    defaultValues?: Partial<IngredientGet>;
    // options?: { stockup?: boolean };
    close?: () => void;
  };
}) {
  const { stockMovementCreate } = useStockMovementActions();

  const { form, submitted, handleSubmit } = useFormIngredient({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (props?.close) props.close();
      })}
      noValidate
    >
      <Card bg={'var(--mantine-color-body)'} shadow="xs" pt={'xs'}>
        <Grid>
          <GridCol span={8}>
            <Fieldset legend="Ingredient details">
              <Grid gap={mobile ? 5 : undefined}>
                <GridCol span={12}>
                  <TextInput
                    required
                    label="Title"
                    placeholder={`Title`}
                    data-autofocus={!props?.defaultValues?.updatedAt ? true : undefined}
                    leftSection={<IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('name')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <NumberInput
                    required
                    label="Stock Quantity"
                    placeholder="Stock Quantity"
                    min={0}
                    leftSection={<IconStack3 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('stockQuantity')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <NumberInput
                    required
                    label="Low Stock Margin"
                    placeholder="Low Stock Margin"
                    min={0}
                    leftSection={<IconStack2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('lowStockMargin')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <NumberInput
                    required
                    label="Stockout Margin"
                    placeholder="Stockout Margin"
                    min={0}
                    leftSection={<IconStack size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('stockoutMargin')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <NumberInput
                    required
                    label="Stock Capacity"
                    placeholder="Stock Capacity"
                    min={0}
                    leftSection={<IconContainer size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('stockCapacity')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <Select
                    required
                    label="Unit"
                    placeholder="Unit"
                    allowDeselect={false}
                    checkIconPosition="right"
                    leftSection={<IconMeterCube size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    data={[
                      {
                        value: MeasurementUnitType.GRAMS,
                        label: capitalizeWords(MeasurementUnitType.GRAMS),
                      },
                      {
                        value: MeasurementUnitType.MILLILITRES,
                        label: capitalizeWords(MeasurementUnitType.MILLILITRES),
                      },
                    ]}
                    {...form.getInputProps('unit')}
                  />
                </GridCol>
              </Grid>
            </Fieldset>
          </GridCol>

          <GridCol span={4}>
            <Stack>
              <Fieldset legend="Ingredient status">
                <RadioGroup
                  name="ingredient-status"
                  label="Select the ingredient's current status"
                  description="This determines the ingredient's visibility to users"
                  required
                  {...form.getInputProps('status')}
                >
                  <Group mt="xs">
                    <Radio value={Status.DRAFT} label={capitalizeWords(Status.DRAFT)} />
                    <Radio value={Status.INACTIVE} label={capitalizeWords(Status.INACTIVE)} />
                    <Radio value={Status.ACTIVE} label={capitalizeWords(Status.ACTIVE)} />
                  </Group>
                </RadioGroup>
              </Fieldset>
            </Stack>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group mt={mobile ? 'xs' : undefined}>
              <Button
                color="gray"
                loading={submitted}
                component={Link}
                href={`/dashboard/ingredients/stock`}
              >
                Cancel
              </Button>

              <Group display={form.isDirty() ? undefined : 'none'}>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updatedAt ? 'Save Draft' : 'Update'}
                </Button>
              </Group>

              <Button
                type="submit"
                loading={submitted}
                color="blue"
                display={
                  !props?.defaultValues?.updatedAt || props.defaultValues.status != Status.ACTIVE
                    ? undefined
                    : 'none'
                }
                onClick={() => {
                  form.setValues({ ...form.values, status: Status.ACTIVE });

                  handleSubmit({
                    values: { ...form.values, status: Status.ACTIVE },
                  });
                }}
              >
                Publish
              </Button>
            </Group>
          </GridCol>
        </Grid>
      </Card>
    </form>
  );
}
