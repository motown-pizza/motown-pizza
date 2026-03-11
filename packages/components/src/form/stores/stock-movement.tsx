'use client';

import React, { useEffect, useState } from 'react';
import { useFormStockMovement } from '@repo/hooks/form/stock-movement';
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
  IconCaretUpDown,
  IconContainer,
  IconLetterCase,
  IconMeterCube,
  IconStack,
  IconStack2,
  IconStack3,
  IconStackPop,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IngredientGet } from '@repo/types/models/ingredient';
import { useDebouncedCallback, useMediaQuery } from '@mantine/hooks';
import { capitalizeWords } from '@repo/utilities/string';
import {
  MeasurementUnitType,
  Status,
  StockMovementType,
} from '@repo/types/models/enums';
import { useStockMovementActions } from '@repo/hooks/actions/stock-movement';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function StockMovement({
  props,
}: {
  props?: {
    defaultValues?: Partial<IngredientGet>;
    // options?: { stockup?: boolean };
    close?: () => void;
  };
}) {
  const { stockMovementCreate } = useStockMovementActions();

  const { form, submitted, handleSubmit } = useFormStockMovement({
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
              <Grid gutter={mobile ? 5 : undefined}>
                <GridCol span={{ base: 12, xs: 6 }}>
                  <NumberInput
                    required
                    label="Change Quantity"
                    placeholder="Change Quantity"
                    description="Units are in 1/1000's (eg. grams, mililitres, etc)"
                    min={0}
                    leftSection={
                      <IconStackPop
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    }
                    {...form.getInputProps('quantity')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <Select
                    required
                    label="Change Type"
                    placeholder="Change Type"
                    description="Adds or subtracts from ingredient stock"
                    allowDeselect={false}
                    checkIconPosition="right"
                    leftSection={
                      <IconCaretUpDown
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    }
                    data={[
                      {
                        value: StockMovementType.CONSUMPTION,
                        label: capitalizeWords(StockMovementType.CONSUMPTION),
                      },
                      {
                        value: StockMovementType.PURCHASE,
                        label: capitalizeWords(StockMovementType.PURCHASE),
                      },
                    ]}
                    {...form.getInputProps('type')}
                  />
                </GridCol>
              </Grid>
            </Fieldset>
          </GridCol>

          <GridCol span={4}>
            <Stack>aside</Stack>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group mt={mobile ? 'xs' : undefined}>
              <Button
                color="dark"
                loading={submitted}
                component={Link}
                href={`/dashboard/ingredients/stock-movements`}
              >
                Cancel
              </Button>

              <Group display={form.isDirty() ? undefined : 'none'}>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updated_at ? 'Save' : 'Update'}
                </Button>
              </Group>
            </Group>
          </GridCol>
        </Grid>
      </Card>
    </form>
  );
}
