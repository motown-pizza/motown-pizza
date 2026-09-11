import React, { useEffect, useState } from 'react';
import { ProductGet } from '@repo/types';
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
import { ImageDefault } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconShoppingCart } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreProductVariant } from '@repo/store';
import { useStoreCartItem } from '@repo/store';
import { useCartItemActions } from '@repo/store';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import { useStoreRecipieItem } from '@repo/store';
import { useStoreIngredient } from '@repo/store';

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

  const productVariantsCurrent = (productVariants || []).filter((pv) => pv.productId == props.id);
  const recipieItemsCurrent = recipieItems?.filter((ri) => {
    const productVariantIds = productVariantsCurrent?.map((pv) => pv.id);
    return productVariantIds?.includes(ri.productVariantId);
  });
  const ingredientIds = recipieItemsCurrent?.map((ri) => ri.ingredientId);
  const ingredientsCurrent = ingredients?.filter((i) => ingredientIds?.includes(i.id));
  const content = `${ingredientsCurrent?.map((ci) => ci.name).join(', ') ?? ''}`;

  useEffect(() => {
    const handleVariantId = () => {
      if (!variantId && productVariantsCurrent.length) {
        const variant = sortArray(productVariantsCurrent, (i) => i.createdAt, Order.ASCENDING)[0];
        setSelectedVariantId(variant.id);
        if (variant.price) setPrice(variant.price);
      }
    };

    handleVariantId();
  }, [productVariants, productVariants]);

  const inCart = cartItems?.find((ci) => ci.productVariantId == variantId);

  const handleAddCart = () => {
    if (inCart) {
      cartItemUpdate({ ...inCart, quantity: (inCart.quantity || 0) + 1 });
    } else {
      cartItemCreate({
        quantity: 1,
        productVariantId: variantId,
      });
    }
  };

  // const external = props.image.includes('https');
  // const drink = props.image.includes('drink');
  const isOrder = pathname.includes('order');

  return (
    <Card radius={'lg'} h={'100%'} bg={'var(--mantine-color-dark-9)'} withBorder pt={0}>
      <Stack h={'100%'} justify="space-between">
        <div>
          <CardSection bg={'var(--mantine-color-dark-8)'} py={'xl'}>
            <ImageDefault
              src={props.image}
              alt={props.title}
              height={{ base: 240, md: 280, xl: 240 }}
              fit={'contain'}
            />
          </CardSection>

          <Stack mt={'md'}>
            <Title order={3} fz={'lg'} fw={'bold'} c={'sec'}>
              {props.title}
            </Title>

            {props.description ? (
              <Text fz={'md'} mih={75}>
                {props.description}
              </Text>
            ) : (
              content && (
                <Text fz={'md'} mih={75}>
                  {content}
                </Text>
              )
            )}
          </Stack>

          <Stack mt={'md'}>
            <Group justify="space-between">
              <Text>
                Kshs.{' '}
                <Text component="span" inherit fz={'xl'} fw={'bold'} c={'ter'}>
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
                      color="ter"
                      onClick={handleAddCart}
                    >
                      <IconShoppingCart size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
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
                                cartItems?.find((ci) => ci.productVariantId == variantId)
                                  ?.quantity || 0
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
        </div>

        <div>
          {productVariantsCurrent && productVariantsCurrent.length > 1 && (
            <>
              <Divider
                my={'xs'}
                label={'Select variant'}
                styles={{ label: { fontSize: 'var(--mantine-font-size-sm)' } }}
              />

              {
                <Select
                  w={'100%'}
                  aria-label="Pick variant"
                  placeholder="Pick variant"
                  checkIconPosition="right"
                  allowDeselect={false}
                  data={sortArray(productVariantsCurrent, (i) => i.title, Order.ASCENDING).map(
                    (pv) => ({
                      value: pv.id,
                      label: pv.title || pv.size,
                    }),
                  )}
                  value={variantId}
                  comboboxProps={{ width: 'fit-content', position: 'bottom-start' }}
                  variant="default"
                  // styles={{
                  //   dropdown: {
                  //     minWidth: 220,
                  //   },
                  // }}
                  onChange={(v) => {
                    setSelectedVariantId(v as string);
                    const variant = productVariantsCurrent.find((va) => va.id == v);
                    if (variant && variant.price) setPrice(variant.price);
                  }}
                />
              }
            </>
          )}
        </div>
      </Stack>
    </Card>
  );
}
