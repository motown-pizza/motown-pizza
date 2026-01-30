'use client';

import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Card,
  Center,
  Group,
  NumberFormatter,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ProductGet } from '@repo/types/models/product';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { useCartItemActions } from '@repo/hooks/actions/cart-item';
import { useOrderPlacementData } from '@/hooks/order';

export default function MenuItem({ props }: { props: ProductGet }) {
  const { orderDetails } = useOrderPlacementData();
  const { productVariants } = useStoreProductVariant();
  const productVariantsCurrent = productVariants?.filter(
    (pv) => pv.product_id == props.id
  );
  const [currentVariant, setCurrentVariant] = useState('');
  const productVariantCurrent = productVariants?.find(
    (pv) => pv.id == currentVariant
  );
  const [currentQuantity, setCurrentQuantity] = useState(1);

  useEffect(() => {
    if (productVariantsCurrent?.length) {
      setCurrentVariant(productVariantsCurrent[0].id);
    }
  }, [productVariants]);

  const { cartItems } = useStoreCartItem();
  const { cartItemCreate, cartItemUpdate } = useCartItemActions();

  const inCart = cartItems?.find(
    (ci) => ci.product_variant_id == currentVariant
  );

  const handleAddCart = () => {
    if (!orderDetails) return;

    if (inCart) {
      cartItemUpdate({
        ...inCart,
        quantity: (inCart.quantity || 0) + currentQuantity,
      });
    } else {
      cartItemCreate({
        quantity: currentQuantity,
        product_variant_id: currentVariant,
      });
    }

    setCurrentQuantity(1);
  };

  return (
    <Card bg={'var(--mantine-color-dark-9)'}>
      <Stack>
        <Group align="start" justify="space-between" wrap="nowrap" mih={44.1}>
          <Group>
            <div>
              <Title order={3} fz={'md'} fw={'bold'}>
                {props.title}
              </Title>

              <Text fz={'sm'} c={'dimmed'} lineClamp={1}>
                {props.description}
              </Text>
            </div>
          </Group>

          <Group justify="end">
            <ActionIcon
              size={ICON_WRAPPER_SIZE * 1.2}
              onClick={handleAddCart}
              color="ter.6"
              c={inCart ? 'var(--mantine-color-black)' : undefined}
              variant={inCart ? undefined : 'light'}
              disabled={!orderDetails}
            >
              <IconShoppingCart
                size={ICON_SIZE * 1.2}
                stroke={ICON_STROKE_WIDTH}
              />
            </ActionIcon>
          </Group>
        </Group>

        <Group justify="space-between">
          {productVariantsCurrent?.length && (
            <Select
              w={'100%'}
              placeholder="Pick size"
              radius={'lg'}
              checkIconPosition="right"
              allowDeselect={false}
              variant="filled"
              styles={{
                input: { backgroundColor: 'var(--mantine-color-dark-7)' },
              }}
              data={productVariantsCurrent.map((pv) => ({
                value: pv.id,
                label: pv.title || pv.size,
              }))}
              comboboxProps={{
                width: 'fit-content',
                position: 'bottom-start',
              }}
              value={currentVariant}
              onChange={(v) => setCurrentVariant(v || '')}
            />
          )}
        </Group>

        <Group justify="space-between" fw={'500'}>
          <Group>
            <Text inherit>
              Kshs.{' '}
              <Text component="span" inherit fw={'bold'} c={'sec'} fz={'lg'}>
                <NumberFormatter value={productVariantCurrent?.price || 0} />
              </Text>
            </Text>
          </Group>

          <Group justify="end" gap={0}>
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              color="gray"
              variant="light"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              onClick={() =>
                currentQuantity > 1 && setCurrentQuantity(currentQuantity - 1)
              }
              disabled={!orderDetails}
            >
              <IconMinus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>

            <Paper px={'xs'} bg={'var(--mantine-color-dark-7)'} radius={0}>
              <Center mih={ICON_WRAPPER_SIZE} miw={16}>
                <Text inherit fz={'sm'}>
                  {currentQuantity}
                </Text>
              </Center>
            </Paper>

            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              color="gray"
              variant="light"
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              onClick={() =>
                currentQuantity < 10 && setCurrentQuantity(currentQuantity + 1)
              }
              disabled={!orderDetails}
            >
              <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
