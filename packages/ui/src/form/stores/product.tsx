'use client';

import React from 'react';
import { useFormProduct } from '@repo/hooks';
import {
  Button,
  Card,
  Center,
  Divider,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  Radio,
  RadioGroup,
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
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { ProductDietarySubType, ProductGet } from '@repo/types';
import { useMediaQuery } from '@mantine/hooks';
import { ProductDietaryType, ProductType, Status } from '@repo/types';
import { capitalizeWords } from '@repo/utils';
import { useStoreProductVariant } from '@repo/store';
import { ModalCrudProductVariant } from '../../modal/crud/product-variant';
import { CardProductVariant } from '../../card/product-variant';
import { DropzoneImage } from '../../dropzone/image';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import Link from 'next/link';

export function FormStoresProduct({
  props,
}: {
  props?: {
    defaultValues?: Partial<ProductGet>;
  };
}) {
  const { form, submitted, handleSubmit } = useFormProduct({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  const { productVariants } = useStoreProductVariant();

  const productVarintsCurrent = productVariants?.filter(
    (pv) => pv.productId == props?.defaultValues?.id,
  );

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();
      })}
      noValidate
    >
      <Card bg={'var(--mantine-color-body)'} shadow="xs" pt={'xs'}>
        <Grid>
          <GridCol span={8}>
            <Stack>
              <Fieldset legend="Basic product information">
                <Grid>
                  <GridCol span={12}>
                    <TextInput
                      required
                      label="Title"
                      placeholder="Title"
                      data-autofocus={!props?.defaultValues?.updatedAt ? true : undefined}
                      leftSection={<IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                      {...form.getInputProps('title')}
                    />
                  </GridCol>

                  <GridCol span={{ base: 12, xs: 6 }}>
                    <Select
                      label="Type"
                      placeholder="Type"
                      allowDeselect={false}
                      checkIconPosition="right"
                      leftSection={<IconSalad size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
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
                      label="Dietary Class"
                      placeholder="Dietary Class"
                      allowDeselect={false}
                      checkIconPosition="right"
                      leftSection={<IconToolsKitchen size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
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
                      {...form.getInputProps('dietaryClass')}
                    />
                  </GridCol>

                  <GridCol span={{ base: 12, xs: 6 }}>
                    <Select
                      label="Dietary SubClass"
                      placeholder="Dietary SubClass"
                      allowDeselect={false}
                      checkIconPosition="right"
                      leftSection={<IconToolsKitchen size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                      data={[
                        {
                          value: ProductDietarySubType.BEEF,
                          label: capitalizeWords(ProductDietarySubType.BEEF),
                        },
                        {
                          value: ProductDietarySubType.CHICKEN,
                          label: capitalizeWords(ProductDietarySubType.CHICKEN),
                        },
                        {
                          value: ProductDietarySubType.SAUCE,
                          label: capitalizeWords(ProductDietarySubType.SAUCE),
                        },
                      ]}
                      {...form.getInputProps('dietarySubClass')}
                    />
                  </GridCol>

                  <GridCol span={12}>
                    <Textarea
                      // required
                      label="Description"
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
                </Grid>
              </Fieldset>

              {props?.defaultValues?.updatedAt && (
                <Fieldset legend="Product variants">
                  <Grid>
                    <GridCol span={12}>
                      {productVariants === undefined ? (
                        <Center mih={100}>
                          <Loader size={'xs'} />
                        </Center>
                      ) : (
                        <Stack gap={0}>
                          {!productVarintsCurrent?.length ? (
                            <Stack align="center" mih={100} py={'xl'}>
                              <Text fz={'sm'} ta={'center'} c={'dimmed'}>
                                No product variants found.
                              </Text>
                            </Stack>
                          ) : (
                            <Stack gap={'xs'}>
                              {sortArray(
                                productVarintsCurrent,
                                (i) => i.createdAt,
                                Order.DESCENDING,
                              ).map((pv2, i) => (
                                <div key={i}>
                                  {/* {i > 0 && <Divider />} */}
                                  <CardProductVariant props={pv2} />
                                </div>
                              ))}
                            </Stack>
                          )}

                          <Divider my={'md'} />

                          <Group justify="space-between" align="end">
                            <ModalCrudProductVariant
                              props={{
                                defaultValues: {
                                  productId: props.defaultValues.id || '',
                                },
                              }}
                            >
                              <Button
                                size="xs"
                                variant="default"
                                leftSection={
                                  <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                                }
                              >
                                Add Variant
                              </Button>
                            </ModalCrudProductVariant>
                          </Group>
                        </Stack>
                      )}
                    </GridCol>
                  </Grid>
                </Fieldset>
              )}
            </Stack>
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
                      <Radio value={Status.DRAFT} label={capitalizeWords(Status.DRAFT)} />
                      <Radio value={Status.INACTIVE} label={capitalizeWords(Status.INACTIVE)} />
                      <Radio value={Status.ACTIVE} label={capitalizeWords(Status.ACTIVE)} />
                    </Group>
                  </RadioGroup>
                </Fieldset>
              </GridCol>

              <GridCol span={12}>
                <Fieldset legend="Product visuals">
                  <DropzoneImage props={{ form }} />
                </Fieldset>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group mt={mobile ? 'xs' : undefined}>
              <Button
                color="gray"
                loading={submitted}
                component={Link}
                href={`/dashboard/products/${form.values.type?.toLowerCase()}s`}
              >
                Cancel
              </Button>

              <Group>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updatedAt ? 'Save Draft' : 'Done'}
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
