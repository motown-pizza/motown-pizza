'use client';

import React, { useEffect, useState } from 'react';
import { useFormIngredient } from '@/hooks/form/ingredient';
import {
  Button,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Select,
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
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IngredientGet } from '@repo/types/models/ingredient';
import { useDebouncedCallback, useMediaQuery } from '@mantine/hooks';
import { capitalizeWords } from '@repo/utilities/string';
import {
  MeasurementUnitType,
  StockMovementType,
} from '@repo/types/models/enums';
import { useStockMovementActions } from '@repo/hooks/actions/stock-movement';

export default function Ingredient({
  props,
}: {
  props?: {
    defaultValues?: Partial<IngredientGet>;
    options?: { stockup?: boolean };
    close?: () => void;
  };
}) {
  const { stockMovementCreate } = useStockMovementActions();

  const { form, submitted, handleSubmit } = useFormIngredient({
    defaultValues: props?.defaultValues,
  });

  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockUp, setStockUp] = useState<string | number>('');

  const mobile = useMediaQuery('(max-width: 36em)');

  useEffect(() => {
    if (form.values.stock_quantity)
      setStockQuantity(form.values.stock_quantity);
  }, []);

  const handleupdate = useDebouncedCallback(() => {
    if (!stockUp) {
      form.reset();
    } else {
      form.setFieldValue('stock_quantity', stockQuantity + Number(stockUp));
    }
  }, 250);

  useEffect(() => {
    handleupdate();
  }, [stockUp]);

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();

        if (props?.defaultValues?.updated_at && props.options?.stockup) {
          stockMovementCreate({
            ingredient_id: props.defaultValues.id,
            quantity: Number(stockUp),
            type: StockMovementType.PURCHASE,
          });
        }

        if (props?.close) props.close();
      })}
      noValidate
    >
      <Grid gutter={mobile ? 5 : undefined}>
        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Title' : undefined}
            aria-label="Title"
            placeholder={`Title`}
            data-autofocus={
              !props?.defaultValues?.updated_at ? true : undefined
            }
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            disabled={props?.options?.stockup}
            {...form.getInputProps('name')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <NumberInput
            required
            label={mobile ? 'Stock Quantity' : undefined}
            aria-label="Stock Quantity"
            placeholder="Stock Quantity"
            min={0}
            leftSection={
              <IconStack3 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            disabled={props?.options?.stockup}
            {...form.getInputProps('stock_quantity')}
          />
        </GridCol>

        {props?.options?.stockup && (
          <GridCol span={{ base: 12, xs: 6 }}>
            <NumberInput
              required
              label={mobile ? 'Stock-up Quantity' : undefined}
              aria-label="Stock-up Quantity"
              placeholder="Stock-up Quantity"
              min={0}
              leftSection={
                <IconStack3 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              value={stockUp}
              onChange={setStockUp}
            />
          </GridCol>
        )}

        {!props?.options?.stockup && (
          <GridCol span={{ base: 12, xs: 6 }}>
            <NumberInput
              required
              label={mobile ? 'Low Stock Margin' : undefined}
              aria-label="Low Stock Margin"
              placeholder="Low Stock Margin"
              min={0}
              leftSection={
                <IconStack2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              {...form.getInputProps('low_stock_margin')}
            />
          </GridCol>
        )}

        {!props?.options?.stockup && (
          <GridCol span={{ base: 12, xs: 6 }}>
            <NumberInput
              required
              label={mobile ? 'Stockout Margin' : undefined}
              aria-label="Stockout Margin"
              placeholder="Stockout Margin"
              min={0}
              leftSection={
                <IconStack size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              {...form.getInputProps('stockout_margin')}
            />
          </GridCol>
        )}

        {!props?.options?.stockup && (
          <GridCol span={{ base: 12, xs: 6 }}>
            <NumberInput
              required
              label={mobile ? 'Stock Capacity' : undefined}
              aria-label="Stock Capacity"
              placeholder="Stock Capacity"
              min={0}
              leftSection={
                <IconContainer size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              {...form.getInputProps('stock_capacity')}
            />
          </GridCol>
        )}

        <GridCol span={{ base: 12, xs: 6 }}>
          <Select
            required
            label={mobile ? 'Unit' : undefined}
            aria-label="Unit"
            placeholder="Unit"
            allowDeselect={false}
            checkIconPosition="right"
            leftSection={
              <IconMeterCube size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
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
            disabled={props?.options?.stockup}
            {...form.getInputProps('unit')}
          />
        </GridCol>

        <GridCol span={12}>
          <Group justify="end" mt={mobile ? 'xs' : undefined}>
            <Button fullWidth type="submit" loading={submitted}>
              {!props?.defaultValues?.updated_at ? 'Add' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
