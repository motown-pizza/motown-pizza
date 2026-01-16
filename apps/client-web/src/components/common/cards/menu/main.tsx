import React, { useEffect, useState } from 'react';
import { ProductGet } from '@repo/types/models/product';
import {
  ActionIcon,
  Button,
  Card,
  CardSection,
  Divider,
  Group,
  NumberFormatter,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import ImageDefault from '@repo/components/common/images/default';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconShoppingCart } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import { useCartItemActions } from '@repo/hooks/actions/cart-item';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';

export default function Main({
  props,
  options,
}: {
  props: ProductGet;
  options?: { small?: boolean };
}) {
  const [variantId, setSelectedVariantId] = useState('');
  const [price, setPrice] = useState(0);

  const pathname = usePathname();
  const { cartItems } = useStoreCartItem();
  const { cartItemCreate, cartItemUpdate } = useCartItemActions();

  const { productVariants } = useStoreProductVariant();
  const { recipieItems } = useStoreRecipieItem();
  const { ingredients } = useStoreIngredient();

  const productVariantsCurrent = (productVariants || []).filter(
    (pv) => pv.product_id == props.id
  );
  const recipieItemsCurrent = recipieItems?.filter((ri) => {
    const productVariantIds = productVariantsCurrent?.map((pv) => pv.id);
    return productVariantIds?.includes(ri.product_variant_id);
  });
  const ingredientIds = recipieItemsCurrent?.map((ri) => ri.ingredient_id);
  const ingredientsCurrent = ingredients?.filter((i) =>
    ingredientIds?.includes(i.id)
  );
  const content = `${ingredientsCurrent?.map((ci) => ci.name).join(', ') ?? ''}`;

  useEffect(() => {
    if (!variantId && productVariantsCurrent.length) {
      const variant = sortArray(
        productVariantsCurrent,
        (i) => i.created_at,
        Order.ASCENDING
      )[0];
      setSelectedVariantId(variant.id);
      if (variant.price) setPrice(variant.price);
    }
  }, [productVariants, productVariants]);

  const inCart = cartItems?.find((ci) => ci.product_variant_id == variantId);

  const handleAddCart = () => {
    if (inCart) {
      cartItemUpdate({ ...inCart, quantity: (inCart.quantity || 0) + 1 });
    } else {
      cartItemCreate({
        quantity: 1,
        product_variant_id: variantId,
      });
    }
  };

  // const external = props.image.includes('https');
  // const drink = props.image.includes('drink');
  const isOrder = pathname.includes('order');

  return (
    <Card
      radius={'lg'}
      h={'100%'}
      bg={'var(--mantine-color-dark-8)'}
      withBorder
    >
      <Stack h={'100%'} justify="space-between" gap={'xs'}>
        <div>
          <CardSection bg={'var(--mantine-color-dark-7)'} py={'xl'}>
            <ImageDefault
              src={props.image}
              alt={props.title}
              height={240}
              fit={'contain'}
            />
          </CardSection>

          <Stack mt={'md'}>
            <Title order={3} fz={'md'} fw={500} c={'blue.6'}>
              {props.title}
            </Title>

            {/* {props.description && <Text fz={'sm'}>{props.description}</Text>} */}
            {content && <Text fz={'sm'}>{content}</Text>}
          </Stack>
        </div>

        <div>
          <Stack>
            <Group justify="space-between">
              <Text fz={'sm'}>
                Kshs.{' '}
                <Text component="span" inherit fz={'md'} fw={'bold'} c={'sec'}>
                  <NumberFormatter value={price} />
                </Text>
              </Text>

              <Tooltip
                label={
                  inCart ? (
                    <Text component="span" inherit>
                      <NumberFormatter value={inCart.quantity || 0} /> in{' '}
                      {isOrder ? 'order' : 'cart'}
                    </Text>
                  ) : (
                    `Add to ${isOrder ? 'order' : 'cart'}`
                  )
                }
              >
                <Group gap={'xs'}>
                  {!isOrder || options?.small ? (
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE}
                      variant={inCart ? 'light' : 'subtle'}
                      color="ter.6"
                      onClick={handleAddCart}
                    >
                      <IconShoppingCart
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  ) : (
                    <Group>
                      <Button
                        fullWidth
                        size="xs"
                        variant={inCart ? 'filled' : 'light'}
                        color={'ter'}
                        c={inCart ? 'var(--mantine-color-body)' : undefined}
                        onClick={handleAddCart}
                        rightSection={
                          <Text component="span" inherit>
                            (
                            <NumberFormatter
                              value={
                                cartItems?.find(
                                  (ci) => ci.product_variant_id == variantId
                                )?.quantity || 0
                              }
                            />
                            )
                          </Text>
                        }
                      >
                        {inCart ? 'Added' : 'Add'} to order
                      </Button>
                    </Group>
                  )}
                </Group>
              </Tooltip>
            </Group>
          </Stack>

          <Divider my={'xs'} label={'Select variant'} />

          {productVariantsCurrent && (
            <Select
              w={'100%'}
              placeholder="Pick size"
              radius={'lg'}
              size="xs"
              checkIconPosition="right"
              allowDeselect={false}
              data={productVariantsCurrent.map((pv) => ({
                value: pv.id,
                label: pv.title || pv.size,
              }))}
              value={variantId}
              onChange={(v) => {
                setSelectedVariantId(v as string);
                const variant = productVariantsCurrent.find((va) => va.id == v);
                if (variant && variant.price) setPrice(variant.price);
              }}
            />
          )}
        </div>
      </Stack>
    </Card>
  );
}
