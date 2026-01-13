'use client';

import React from 'react';
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
  IconLetterCase,
  IconMeterCube,
  IconNumber,
  IconPackage,
  IconPackageImport,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IngredientGet } from '@repo/types/models/ingredient';
import { useMediaQuery } from '@mantine/hooks';
import { capitalizeWords } from '@repo/utilities/string';
import { MeasurementUnitType } from '@repo/types/models/enums';

export default function Ingredient({
  props,
}: {
  props?: {
    defaultValues?: Partial<IngredientGet>;
    close?: () => void;
  };
}) {
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
            {...form.getInputProps('name')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 4 }}>
          <NumberInput
            required
            label={mobile ? 'Stock Quantity' : undefined}
            aria-label="Stock Quantity"
            placeholder="Stock Quantity"
            min={0}
            leftSection={
              <IconPackage size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('stock_quantity')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 4 }}>
          <NumberInput
            required
            label={mobile ? 'Stockout Margin' : undefined}
            aria-label="Stockout Margin"
            placeholder="Stockout Margin"
            min={0}
            leftSection={
              <IconPackageImport size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('stockout_margin')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 4 }}>
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
                value: MeasurementUnitType.KILOGRAMS,
                label: capitalizeWords(MeasurementUnitType.KILOGRAMS),
              },
              {
                value: MeasurementUnitType.MILLILITRES,
                label: capitalizeWords(MeasurementUnitType.MILLILITRES),
              },
              {
                value: MeasurementUnitType.LITRES,
                label: capitalizeWords(MeasurementUnitType.LITRES),
              },
              // {
              //   value: MeasurementUnitType.PIECES,
              //   label: capitalizeWords(MeasurementUnitType.PIECES),
              // },
            ]}
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
