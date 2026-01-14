import React from 'react';
import {
  ActionIcon,
  Card,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import ImageDefault from '@repo/components/common/images/default';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { capitalizeWords } from '@repo/utilities/string';
import { CartItemGet } from '@repo/types/models/cart-item';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { images } from '@/assets/images';
import { useCartItemActions } from '@repo/hooks/actions/cart-item';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';

export default function Cart({
  props,
  options,
}: {
  props: CartItemGet;
  options?: { checkout?: boolean };
}) {
  const { products } = useStoreProduct();
  const { productVariants } = useStoreProductVariant();

  const { cartItemUpdate, cartItemDelete } = useCartItemActions();

  const { showNotification } = useNotification();

  const variant = (productVariants || []).find(
    (pv) => pv.id == props.product_variant_id
  );
  const product = (products || []).find((p) => p.id == variant?.product_id);
  const external = product?.image.includes('https');
  const drink = product?.image.includes('drink');

  return (
    <Card bg={'transparent'} padding={'xs'}>
      <Grid gutter={0}>
        <GridCol span={options?.checkout ? 1.5 : 3}>
          <ImageDefault
            // src={product?.image||''}
            src={images.products.pizzas.product1}
            alt={product?.title || ''}
            height={{ base: external || drink ? 80 : '100%' }}
            fit={external || drink ? undefined : 'contain'}
            radius={'lg'}
          />
        </GridCol>

        <GridCol span={options?.checkout ? 10.5 : 9} pl={'xs'}>
          <Group justify="space-between">
            <Title order={3} fz={'md'} fw={500} c={'blue.6'} lineClamp={1}>
              {product?.title}
            </Title>

            <Tooltip
              label={`Remove item (${product?.title}) from cart`}
              multiline
              w={240}
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="pri.6"
                onClick={() => {
                  cartItemDelete(props);
                  showNotification({
                    title: 'Item removed',
                    desc: `Item (${product?.title}) removed from cart`,
                    variant: Variant.SUCCESS,
                  });
                }}
              >
                <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {variant && (
            <>
              <Text inherit fz={'sm'}>
                {capitalizeWords(variant.size)}
              </Text>

              <Group justify="space-between" mt={'xs'}>
                <Group>
                  <Text inherit fz={'xs'} c={'dimmed'}>
                    Qty:{' '}
                    <Text component={'span'} inherit fw={500} c={'ter'}>
                      <NumberFormatter value={props.quantity} />
                    </Text>
                  </Text>

                  <Group gap={'xs'}>
                    <Tooltip
                      label={
                        props.quantity <= 1
                          ? 'Currently at minimum'
                          : 'Remove -1'
                      }
                    >
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE - 6}
                        disabled={props.quantity <= 1}
                        onClick={() => {
                          cartItemUpdate({
                            ...props,
                            quantity: props.quantity - 1,
                          });
                        }}
                      >
                        <IconMinus
                          size={ICON_SIZE - 6}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip
                      label={
                        props.quantity >= 10 ? 'Currently at maximum' : 'Add +1'
                      }
                    >
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE - 6}
                        disabled={props.quantity >= 10}
                        onClick={() => {
                          cartItemUpdate({
                            ...props,
                            quantity: props.quantity + 1,
                          });
                        }}
                      >
                        <IconPlus
                          size={ICON_SIZE - 4}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Text inherit fz={'sm'}>
                  Kshs.{' '}
                  <Text component="span" inherit fz={'md'} fw={500} c={'sec'}>
                    <NumberFormatter
                      value={(variant.price || 0) * props.quantity}
                    />
                  </Text>
                </Text>
              </Group>
            </>
          )}
        </GridCol>
      </Grid>
    </Card>
  );
}
