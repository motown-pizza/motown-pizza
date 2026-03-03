'use client';

import React from 'react';
import { useFormProductVariant } from '@/hooks/form/product-variant';
import {
  Button,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  NumberInput,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconLetterCase,
  IconPlus,
  IconPremiumRights,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { useMediaQuery } from '@mantine/hooks';
import { Size } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import ModalCrudRecipieItem from '../common/modals/crud/recipie-item';
import CardRecipieItem from '../common/cards/recipie-item';

export default function ProductVariant({
  props,
}: {
  props?: {
    defaultValues?: Partial<ProductVariantGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormProductVariant({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  const { products } = useStoreProduct();
  const product = products?.find(
    (p) => p.id == props?.defaultValues?.product_id
  );

  const { recipieItems } = useStoreRecipieItem();

  const productVarintRecipieItems = recipieItems?.filter(
    (ri) => ri.product_variant_id == props?.defaultValues?.id
  );

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
        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Title' : undefined}
            aria-label="Title"
            placeholder={`eg. ${capitalizeWords(Size.MEDIUM)} ${product?.title}`}
            data-autofocus={
              !props?.defaultValues?.updated_at ? true : undefined
            }
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('title')}
          />
        </GridCol>

        {/* <GridCol span={{ base: 12, xs: 6 }}>
          <Select
            // required
            label={mobile ? 'Size' : undefined}
            aria-label="Size"
            placeholder="Size"
            allowDeselect={false}
            checkIconPosition="right"
            leftSection={
              <IconDimensions size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={[
              {
                value: Size.SMALL,
                label: capitalizeWords(Size.SMALL),
              },
              {
                value: Size.MEDIUM,
                label: capitalizeWords(Size.MEDIUM),
              },
              {
                value: Size.LARGE,
                label: capitalizeWords(Size.LARGE),
              },
              {
                value: Size.EXTRALARGE,
                label: capitalizeWords(Size.EXTRALARGE),
              },
            ]}
            {...form.getInputProps('size')}
          />
        </GridCol> */}

        {/* <GridCol span={{ base: 12, xs: 6 }}>
          <TextInput
            required
            label={mobile ? 'Measurement' : undefined}
            aria-label="Measurement"
            placeholder="Measurement"
            leftSection={
              <IconRuler2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('measurement')}
          />
        </GridCol> */}

        <GridCol span={12}>
          <NumberInput
            required
            label={mobile ? 'Price' : undefined}
            aria-label="Price"
            placeholder="Price"
            min={0}
            leftSection={
              <IconPremiumRights size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('price')}
          />
        </GridCol>

        {props?.defaultValues?.updated_at && (
          <GridCol span={12}>
            <ScrollAreaAutosize mah={200}>
              {productVarintRecipieItems === undefined ? (
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
                      Recipie Items
                    </Text>

                    <ModalCrudRecipieItem
                      props={{
                        defaultValues: {
                          product_variant_id: props.defaultValues.id || '',
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
                        Add Recipie Item
                      </Button>
                    </ModalCrudRecipieItem>
                  </Group>

                  <Divider />

                  {!productVarintRecipieItems?.length ? (
                    <Stack align="center" mih={100} py={'xl'}>
                      <Text fz={'sm'} ta={'center'} c={'dimmed'}>
                        No recipie items found.
                      </Text>
                    </Stack>
                  ) : (
                    <Stack gap={0}>
                      {sortArray(
                        productVarintRecipieItems,
                        (i) => i.created_at,
                        Order.DESCENDING
                      ).map((ri, i) => (
                        <div key={i}>
                          {i > 0 && <Divider />}
                          <CardRecipieItem props={ri} />
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
