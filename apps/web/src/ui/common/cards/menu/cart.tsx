import React from 'react';
import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { ImageDefault } from '@repo/ui';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreProductVariant } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { CartItemGet } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { useCartItemActions } from '@repo/store';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

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

  const variant = (productVariants || []).find((pv) => pv.id == props.productVariantId);
  const product = (products || []).find((p) => p.id == variant?.productId);
  // const external = product?.image.includes('https');
  // const drink = product?.image.includes('drink');

  const variantTitle = variant?.title?.replace(product?.title || '', '').trim();

  const partialQuantityPrice = (
    <Group justify="space-between" mt={options?.checkout ? undefined : 'md'}>
      <Group gap={'xs'}>
        <Tooltip label={props.quantity <= 1 ? 'Currently at minimum' : 'Remove -1'}>
          <ActionIcon
            variant="default"
            size="md"
            disabled={props.quantity <= 1}
            onClick={() => {
              cartItemUpdate({
                ...props,
                quantity: props.quantity - 1,
              });
            }}
          >
            <IconMinus size={ICON_SIZE - 6} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>

        <Text inherit c={'dimmed'}>
          <Text component={'span'} inherit fw={500} c={'white'}>
            <NumberFormatter value={props.quantity} />
          </Text>
        </Text>

        <Tooltip label={props.quantity >= 10 ? 'Currently at maximum' : 'Add +1'}>
          <ActionIcon
            variant="default"
            size="md"
            disabled={props.quantity >= 10}
            onClick={() => {
              cartItemUpdate({
                ...props,
                quantity: props.quantity + 1,
              });
            }}
          >
            <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Box miw={options?.checkout ? 75 : 0} ta={'end'}>
        <Text inherit fz={'sm'}>
          Kshs.{' '}
          <Text component="span" inherit fz={'md'} fw={500} c={'white'}>
            <NumberFormatter value={(variant?.price || 0) * props.quantity} />
          </Text>
        </Text>
      </Box>
    </Group>
  );

  return (
    <Card bg={'transparent'} padding={'xs'}>
      <Grid gap={0} align={options?.checkout ? 'center' : undefined}>
        <GridCol span={options?.checkout ? 1 : 2}>
          <ImageDefault
            src={product?.image || 'loading'}
            alt={product?.title || 'loading'}
            height={64}
            fit={'contain'}
            radius={'lg'}
          />
        </GridCol>

        <GridCol span={options?.checkout ? 10 : 8.5} pl={'xs'}>
          <Flex direction={options?.checkout ? 'row' : 'column'} justify="space-between">
            <div>
              <Group justify="space-between">
                <Title order={3} fz={'sm'} c={'sec'} lineClamp={1}>
                  {product?.title}
                </Title>
              </Group>

              {variant && (
                <>
                  {variant.title &&
                    product?.title.trim().toLowerCase() != variant.title.trim().toLowerCase() && (
                      <Text inherit c={'dark.1'} fz={'sm'}>
                        {variantTitle}
                      </Text>
                    )}
                </>
              )}
            </div>

            {partialQuantityPrice}
          </Flex>
        </GridCol>

        <GridCol span={options?.checkout ? 1 : 1.5}>
          <Group justify="end">
            <Tooltip label={`Remove item (${product?.title}) from cart`} multiline w={240}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant="default"
                c="red.6"
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
        </GridCol>
      </Grid>
    </Card>
  );
}

