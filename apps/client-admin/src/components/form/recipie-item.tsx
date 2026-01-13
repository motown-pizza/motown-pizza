'use client';

import React from 'react';
import { useFormRecipieItem } from '@/hooks/form/recipie-item';
import {
  Button,
  Center,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Select,
  Text,
} from '@mantine/core';
import {
  IconCheese,
  IconMeterCube,
  IconMilk,
  IconRuler2,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { useMediaQuery } from '@mantine/hooks';
import { useStoreIngredient } from '@/libraries/zustand/stores/ingredient';
import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import { useStoreProduct } from '@/libraries/zustand/stores/product';
import { MeasurementUnitType, ProductType } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';

export default function RecipieItem({
  props,
}: {
  props?: {
    defaultValues?: Partial<RecipieItemGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormRecipieItem({
    defaultValues: props?.defaultValues,
  });

  const { products } = useStoreProduct();
  const { ingredients } = useStoreIngredient();
  const { productVariants } = useStoreProductVariant();

  const mobile = useMediaQuery('(max-width: 36em)');

  let groups: any[] = [];

  products
    ?.filter((p2) => p2.type != ProductType.DRINK)
    .map((p) => {
      const variants = productVariants
        ?.filter((pv) => pv.product_id == p.id)
        .map((pv2) => {
          return { label: pv2.title, value: pv2.id };
        });

      groups = [...groups, { group: p.title, items: variants }];
    });

  const ingredient = ingredients?.find(
    (ii) => ii.id == form.values.ingredient_id
  );

  const solidWeight =
    ingredient?.unit == MeasurementUnitType.GRAMS ||
    ingredient?.unit == MeasurementUnitType.KILOGRAMS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!form.isValid()) {
          form.validate();
        } else {
          handleSubmit();
          if (props?.close) props.close();
        }
      }}
      noValidate
    >
      <Grid gutter={mobile ? 5 : undefined}>
        <GridCol span={{ base: 12 }}>
          <Select
            required
            label={mobile ? 'Ingredient' : undefined}
            aria-label="Ingredient"
            placeholder="Ingredient"
            allowDeselect={false}
            checkIconPosition="right"
            searchable
            nothingFoundMessage={
              <Center py={'md'}>
                <Text ta={'center'} c={'dimmed'} fz={'sm'}>
                  No ingredients found...
                </Text>
              </Center>
            }
            leftSection={
              <IconCheese size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={ingredients?.map((ii) => {
              return { value: ii.id, label: ii.name || '' };
            })}
            {...form.getInputProps('ingredient_id')}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Select
            required
            label={mobile ? 'Product Variant' : undefined}
            aria-label="Product Variant"
            placeholder="Product Variant"
            allowDeselect={false}
            checkIconPosition="right"
            searchable
            nothingFoundMessage={
              <Center py={'md'}>
                <Text ta={'center'} c={'dimmed'} fz={'sm'}>
                  No ingredients found...
                </Text>
              </Center>
            }
            leftSection={
              <IconMilk size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={groups}
            {...form.getInputProps('product_variant_id')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <NumberInput
            required
            label={mobile ? 'Quantity Needed' : undefined}
            aria-label="Quantity Needed"
            placeholder="Quantity Needed"
            min={0}
            leftSection={
              <IconRuler2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('quantity_needed')}
          />
        </GridCol>

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
            data={
              solidWeight
                ? [
                    {
                      value: MeasurementUnitType.GRAMS,
                      label: capitalizeWords(MeasurementUnitType.GRAMS),
                    },
                    {
                      value: MeasurementUnitType.KILOGRAMS,
                      label: capitalizeWords(MeasurementUnitType.KILOGRAMS),
                    },
                  ]
                : [
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
                  ]
            }
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
