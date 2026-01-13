import React from 'react';
import { ProductGet } from '@repo/types/models/product';
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import ImageDefault from '@repo/components/common/images/default';
import { IconX } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { SyncStatus } from '@repo/types/models/enums';
import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import { capitalizeWords } from '@repo/utilities/string';
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { useStoreCartItems } from '@/libraries/zustand/stores/cart';

export default function Cart({
  props,
}: {
  props: { product: ProductGet; productVariant: ProductVariantGet };
}) {
  const { cartItems, setCartItems, deleted, setDeletedCartItems } =
    useStoreCartItems();

  const { productVariants } = useStoreProductVariant();

  const variant = (productVariants || []).find(
    (v) => v.id == props.productVariant.id
  );

  const external = props.product.image.includes('https');
  const drink = props.product.image.includes('drink');

  return (
    <Card bg={'transparent'}>
      <Grid>
        <GridCol span={3}>
          <ImageDefault
            src={props.product.image}
            alt={props.product.title}
            height={{ base: external || drink ? 80 : 60 }}
            fit={external || drink ? undefined : 'contain'}
            radius={'lg'}
          />
        </GridCol>

        <GridCol span={9}>
          <Stack justify="space-between" h={'100%'}>
            <div>
              <Group justify="space-between">
                <Title order={3} fz={'md'} fw={500} c={'sec.6'}>
                  {props.product.title}
                </Title>

                <ActionIcon
                  size={ICON_WRAPPER_SIZE}
                  color="gray.9"
                  onClick={() => {
                    setCartItems(
                      (cartItems || []).filter(
                        (ci) =>
                          `${ci.id}-${props.productVariant.id}` !=
                          `${props.product.id}-${props.productVariant.id}`
                      )
                    );

                    // setDeletedCartItems([
                    //   ...deleted,
                    //   {
                    //     ...props.productVariant,
                    //     sync_status: SyncStatus.DELETED,
                    //   },
                    // ]);
                  }}
                >
                  <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>

              {variant && (
                <Stack gap={'xs'}>
                  <Text inherit fz={'sm'}>
                    {capitalizeWords(variant.size)}
                  </Text>

                  <Text fz={'sm'}>
                    Kshs.{' '}
                    <Text component="span" inherit fz={'md'} fw={'bold'}>
                      <NumberFormatter value={variant.price || 0} />
                    </Text>
                  </Text>
                </Stack>
              )}
            </div>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
