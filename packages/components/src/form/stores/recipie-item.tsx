'use client';

import React from 'react';
import { useFormRecipieItem } from '@repo/hooks/form/recipie-item';
import {
  Button,
  Card,
  Center,
  Divider,
  Fieldset,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Radio,
  RadioGroup,
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
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import {
  MeasurementUnitType,
  ProductType,
  Status,
} from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';
import Link from 'next/link';

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

  const solidWeight = ingredient?.unit == MeasurementUnitType.GRAMS;

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
      <Card bg={'var(--mantine-color-body)'} shadow="xs" pt={'xs'}>
        <Grid>
          <GridCol span={8}>
            <Fieldset legend="Recipie item details">
              <Grid>
                <GridCol span={{ base: 12 }}>
                  <Select
                    required
                    label="Ingredient"
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
                    label="Product Variant"
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
                    label="Quantity Needed"
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
                    label="Unit"
                    placeholder="Unit"
                    allowDeselect={false}
                    checkIconPosition="right"
                    leftSection={
                      <IconMeterCube
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    }
                    data={
                      solidWeight
                        ? [
                            {
                              value: MeasurementUnitType.GRAMS,
                              label: capitalizeWords(MeasurementUnitType.GRAMS),
                            },
                          ]
                        : [
                            {
                              value: MeasurementUnitType.MILLILITRES,
                              label: capitalizeWords(
                                MeasurementUnitType.MILLILITRES
                              ),
                            },
                          ]
                    }
                    {...form.getInputProps('unit')}
                  />
                </GridCol>
              </Grid>
            </Fieldset>
          </GridCol>

          <GridCol span={4}>
            <Grid>
              <GridCol span={12}>
                <Fieldset legend="Product status">
                  <RadioGroup
                    name="product-status"
                    label="Select the product's current status"
                    description="This determines the product's visibility to users"
                    required
                    {...form.getInputProps('status')}
                  >
                    <Group mt="xs">
                      <Radio
                        value={Status.DRAFT}
                        label={capitalizeWords(Status.DRAFT)}
                      />
                      <Radio
                        value={Status.INACTIVE}
                        label={capitalizeWords(Status.INACTIVE)}
                      />
                      <Radio
                        value={Status.ACTIVE}
                        label={capitalizeWords(Status.ACTIVE)}
                      />
                    </Group>
                  </RadioGroup>
                </Fieldset>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group mt={mobile ? 'xs' : undefined}>
              <Button
                color="dark"
                loading={submitted}
                component={Link}
                href={`/dashboard/recipie-items`}
              >
                Cancel
              </Button>

              <Group display={form.isDirty() ? undefined : 'none'}>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updated_at ? 'Save Draft' : 'Update'}
                </Button>
              </Group>

              <Button
                type="submit"
                loading={submitted}
                color="blue"
                display={
                  !props?.defaultValues?.updated_at ||
                  props.defaultValues.status != Status.ACTIVE
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
