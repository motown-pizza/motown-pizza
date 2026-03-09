'use client';

import React from 'react';
import { useFormProduct } from '@repo/hooks/form/product';
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
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconDeviceFloppy,
  IconLetterCase,
  IconPencilCheck,
  IconPlus,
  IconSalad,
  IconSend,
  IconToolsKitchen,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ProductGet } from '@repo/types/models/product';
import { useMediaQuery } from '@mantine/hooks';
import {
  ProductDietaryType,
  ProductType,
  Status,
} from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import ModalCrudProductVariant from '@repo/components/common/modals/crud/product-variant';
import CardProductVariant from '@repo/components/common/cards/product-variant';
import DropzoneImage from '@repo/components/common/dropzones/image';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Product({
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
    (pv) => pv.product_id == props?.defaultValues?.id
  );

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();
      })}
      noValidate
    >
      <Card bg={'var(--mantine-color-body)'} shadow="xs" pt={'xs'}>
        <Grid gutter={mobile ? 5 : undefined}>
          <GridCol span={8}>
            <Stack>
              <Fieldset legend="Basic product information">
                <Grid>
                  <GridCol span={12}>
                    <TextInput
                      required
                      label="Title"
                      placeholder="Title"
                      data-autofocus={
                        !props?.defaultValues?.updated_at ? true : undefined
                      }
                      leftSection={
                        <IconLetterCase
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      }
                      {...form.getInputProps('title')}
                    />
                  </GridCol>

                  <GridCol span={{ base: 12, xs: 6 }}>
                    <Select
                      required
                      label="Type"
                      placeholder="Type"
                      allowDeselect={false}
                      checkIconPosition="right"
                      leftSection={
                        <IconSalad
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
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
                      label="Dietary Class"
                      placeholder="Dietary Class"
                      allowDeselect={false}
                      checkIconPosition="right"
                      leftSection={
                        <IconToolsKitchen
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
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
                      label="Description"
                      placeholder="Description"
                      autosize
                      minRows={1}
                      maxRows={5}
                      leftSection={
                        <IconAlignJustified
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      }
                      {...form.getInputProps('description')}
                    />
                  </GridCol>
                </Grid>
              </Fieldset>

              {props?.defaultValues?.updated_at && (
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
                                (i) => i.created_at,
                                Order.DESCENDING
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
                        </Stack>
                      )}
                    </GridCol>
                  </Grid>
                </Fieldset>
              )}
            </Stack>
          </GridCol>

          <GridCol span={4}>
            <Stack>
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

              <Fieldset legend="Product visuals">
                <DropzoneImage props={{ form }} />
              </Fieldset>
            </Stack>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group mt={mobile ? 'xs' : undefined}>
              <Button
                color="dark"
                loading={submitted}
                component={Link}
                href={`/dashboard/products/${form.values.type?.toLowerCase()}s`}
              >
                Cancel
              </Button>

              <Group display={form.isDirty() ? undefined : 'none'}>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updated_at ? 'Save Draft' : 'Update'}
                </Button>

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
            </Group>
          </GridCol>
        </Grid>
      </Card>
    </form>
  );
}
