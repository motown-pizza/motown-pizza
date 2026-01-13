'use client';

import React from 'react';
import { useFormProduct } from '@/hooks/form/product';
import {
  Button,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconLetterCase,
  IconPlus,
  IconSalad,
  IconToolsKitchen,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ProductGet } from '@repo/types/models/product';
import { useMediaQuery } from '@mantine/hooks';
import { ProductDietaryType, ProductType } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import ModalCrudProductVariant from '../common/modals/crud/product-variant';
import CardProductVariant from '../common/cards/product-variant';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Product({
  props,
}: {
  props?: {
    defaultValues?: Partial<ProductGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormProduct({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  const { productVariants } = useStoreProductVariant();

  const productVarintsCurrent = productVariants?.filter(
    (pv) => pv.product_id == props?.defaultValues?.id
  );

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
            placeholder="Title"
            data-autofocus={
              !props?.defaultValues?.updated_at ? true : undefined
            }
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('title')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <Select
            required
            label={mobile ? 'Type' : undefined}
            aria-label="Type"
            placeholder="Type"
            allowDeselect={false}
            checkIconPosition="right"
            leftSection={
              <IconSalad size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={[
              {
                value: ProductType.PIZZA,
                label: capitalizeWords(ProductType.PIZZA),
              },
              {
                value: ProductType.SIDE,
                label: capitalizeWords(ProductType.SIDE),
              },
              {
                value: ProductType.DRINK,
                label: capitalizeWords(ProductType.DRINK),
              },
            ]}
            {...form.getInputProps('type')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <Select
            required
            label={mobile ? 'Dietary Class' : undefined}
            aria-label="Dietary Class"
            placeholder="Dietary Class"
            allowDeselect={false}
            checkIconPosition="right"
            leftSection={
              <IconToolsKitchen size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={[
              {
                value: ProductDietaryType.MEATY,
                label: capitalizeWords(ProductDietaryType.MEATY),
              },
              {
                value: ProductDietaryType.VEGGIE,
                label: capitalizeWords(ProductDietaryType.VEGGIE),
              },
              {
                value: ProductDietaryType.VEGAN,
                label: capitalizeWords(ProductDietaryType.VEGAN),
              },
              {
                value: ProductDietaryType.NEUTRAL,
                label: capitalizeWords(ProductDietaryType.NEUTRAL),
              },
            ]}
            {...form.getInputProps('dietary_class')}
          />
        </GridCol>

        <GridCol span={12}>
          <Textarea
            required
            label={mobile ? 'Description' : undefined}
            aria-label="Description"
            placeholder="Description"
            autosize
            minRows={1}
            maxRows={5}
            leftSection={
              <IconAlignJustified size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('description')}
          />
        </GridCol>

        {props?.defaultValues?.updated_at && (
          <GridCol span={12}>
            <ScrollAreaAutosize mah={200}>
              {productVariants === undefined ? (
                <Center mih={100}>
                  <Loader size={'xs'} />
                </Center>
              ) : (
                <Stack gap={0}>
                  <Group
                    justify="space-between"
                    align="end"
                    pt={5}
                    pb={'xs'}
                    pr={5}
                    style={{
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'var(--mantine-color-body)',
                      zIndex: 10,
                    }}
                  >
                    <Text fz={'sm'} fw={500} c={'blue'}>
                      Product Variants
                    </Text>

                    <ModalCrudProductVariant
                      props={{
                        defaultValues: {
                          product_id: props.defaultValues.id || '',
                        },
                      }}
                    >
                      <Button
                        size="xs"
                        variant="default"
                        leftSection={
                          <IconPlus
                            size={ICON_SIZE - 4}
                            stroke={ICON_STROKE_WIDTH}
                          />
                        }
                      >
                        Add Variant
                      </Button>
                    </ModalCrudProductVariant>
                  </Group>

                  <Divider />

                  {!productVarintsCurrent?.length ? (
                    <Stack align="center" mih={100} py={'xl'}>
                      <Text fz={'sm'} ta={'center'} c={'dimmed'}>
                        No product variants found.
                      </Text>
                    </Stack>
                  ) : (
                    <Stack gap={0}>
                      {sortArray(
                        productVarintsCurrent,
                        (i) => i.created_at,
                        Order.DESCENDING
                      ).map((pv2, i) => (
                        <div key={i}>
                          {i > 0 && <Divider />}
                          <CardProductVariant props={pv2} />
                        </div>
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}
            </ScrollAreaAutosize>
          </GridCol>
        )}

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
