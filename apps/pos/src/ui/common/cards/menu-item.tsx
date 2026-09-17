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
import { ProductGet } from '@repo/types';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { useStoreIngredient, useStoreProductVariant, useStoreRecipieItem } from '@repo/store';
import { useStoreCartItem } from '@repo/store';
import { useCartItemActions } from '@repo/store';
import { useOrderPlacementData } from '@repo/hooks';

export default function MenuItem({ props }: { props: ProductGet }) {
  const { orderDetails } = useOrderPlacementData();
  const { productVariants } = useStoreProductVariant();
  // const productVariantsCurrent = productVariants?.filter((pv) => pv.productId == props.id);
  const [currentVariant, setCurrentVariant] = useState('');
  const productVariantCurrent = productVariants?.find((pv) => pv.id == currentVariant);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const { recipieItems } = useStoreRecipieItem();
  const { ingredients } = useStoreIngredient();

  const productVariantsCurrent = (productVariants || []).filter((pv) => pv.productId == props.id);
  const recipieItemsCurrent = recipieItems?.filter((ri) => {
    const productVariantIds = productVariantsCurrent?.map((pv) => pv.id);
    return productVariantIds?.includes(ri.productVariantId);
  });
  const ingredientIds = recipieItemsCurrent?.map((ri) => ri.ingredientId);
  const ingredientsCurrent = ingredients?.filter((i) => ingredientIds?.includes(i.id));
  const content = `${ingredientsCurrent?.map((ci) => ci.name).join(', ') ?? ''}`;

  useEffect(() => {
    const handleVariant = () => {
      if (productVariantsCurrent?.length) {
        setCurrentVariant(productVariantsCurrent[0].id);
      }
    };

    handleVariant();
  }, [productVariants]);

  const { cartItems } = useStoreCartItem();
  const { cartItemCreate, cartItemUpdate } = useCartItemActions();

  const inCart = cartItems?.find((ci) => ci.productVariantId == currentVariant);

  const handleAddCart = () => {
    if (!orderDetails) return;

    if (inCart) {
      cartItemUpdate({
        ...inCart,
        quantity: (inCart.quantity || 0) + currentQuantity,
      });
    } else {
      cartItemCreate({
        orderId: orderDetails.id,
        quantity: currentQuantity,
        productVariantId: currentVariant,
      });
    }

    setCurrentQuantity(1);
  };

  return (
    <Card bg={'var(--mantine-color-dark-8)'}>
      <Stack>
        <Group align="start" justify="space-between" wrap="nowrap" mih={44.1}>
          <Stack>
            <Title order={3} fz={'md'} fw={'bold'} c={'sec'}>
              {props.title}
            </Title>

            {props.description ? (
              <Text fz={'sm'} mih={110} c={'dimmed'}>
                {props.description}
              </Text>
            ) : (
              content && (
                <Text fz={'sm'} mih={110} c={'dimmed'}>
                  {content}
                </Text>
              )
            )}
          </Stack>

          <Group justify="end">
            <ActionIcon
              size={ICON_WRAPPER_SIZE * 1.2}
              onClick={handleAddCart}
              color="ter"
              c={inCart ? 'dark.9' : undefined}
              variant={inCart ? undefined : 'light'}
              disabled={!orderDetails}
            >
              <IconShoppingCart size={ICON_SIZE * 1.2} stroke={ICON_STROKE_WIDTH} />
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
              variant="default"
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
              <Text component="span" inherit fw={'bold'} c={'ter'} fz={'lg'}>
                <NumberFormatter value={productVariantCurrent?.price || 0} />
              </Text>
            </Text>
          </Group>

          <Group justify="end" gap={0}>
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              color="dark"
              // variant="light"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              onClick={() => currentQuantity > 1 && setCurrentQuantity(currentQuantity - 1)}
              disabled={!orderDetails}
            >
              <IconMinus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>

            <Paper px={'xs'} bg={'var(--mantine-color-dark-5)'} radius={0}>
              <Center mih={ICON_WRAPPER_SIZE} miw={16}>
                <Text inherit fz={'sm'}>
                  {currentQuantity}
                </Text>
              </Center>
            </Paper>

            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              color="dark"
              // variant="light"
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              onClick={() => currentQuantity < 10 && setCurrentQuantity(currentQuantity + 1)}
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
