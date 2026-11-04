import React, { useEffect, useState } from 'react';
import { ProductGet } from '@repo/types';
import {
  ActionIcon,
  Box,
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
import { IconCheck, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreProductVariant } from '@repo/store';
import { useStoreCartItem } from '@repo/store';
import { useCartItemActions } from '@repo/store';
import { capitalizeWords, sortArray } from '@repo/utils';
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

  const productVariantsArray = sortArray(
    productVariantsCurrent,
    (i) => i.price,
    Order.ASCENDING,
  ).map((pv) => ({
    value: pv.id,
    label: pv.title?.replace(props.title, '').trim(),
    price: pv.price,
  }));

  return (
    <Card radius={'lg'} h={'100%'} bg={'var(--mantine-color-dark-9)'} withBorder pt={0}>
      <Stack h={'100%'} justify="space-between">
        <div>
          <CardSection
            bg={options?.small ? undefined : 'var(--mantine-color-dark-8)'}
            py={options?.small ? undefined : 'xl'}
          >
            <ImageDefault
              src={props.image}
              alt={props.title}
              height={
                options?.small ? { base: 100, md: 100, lg: 100 } : { base: 240, md: 280, lg: 240 }
              }
              fit={'contain'}
            />
          </CardSection>

          <Stack mt={'md'}>
            <Title
              order={3}
              fz={options?.small ? 'xs' : 'md'}
              fw={'bold'}
              c={options?.small ? 'white' : 'sec'}
              mih={33.6}
            >
              {props.title}
            </Title>

            {!options?.small && (
              <>
                {props.description ? (
                  <Text fz={'sm'} mih={90} c={'dark.1'}>
                    {props.description}
                  </Text>
                ) : (
                  content && (
                    <Text fz={'sm'} mih={90} c={'dark.1'}>
                      {content}
                    </Text>
                  )
                )}
              </>
            )}
          </Stack>

          {!options?.small && (
            <Box mt={'md'} mih={53.5}>
              {productVariantsCurrent && (
                <Group wrap="nowrap" gap={'xs'} grow={true}>
                  {productVariantsArray.map((vi) => {
                    if (!vi.label) return null;
                    const active = variantId == vi.value;

                    return (
                      <Card
                        key={vi.value}
                        p={5}
                        withBorder
                        className={
                          `transition-all duration-200` +
                          (active
                            ? ` bg-[var(--mantine-color-pri-light)]/50!`
                            : ` bg-[var(--mantine-color-dark-9)]!`)
                        }
                        style={{
                          cursor: 'pointer',
                          borderWidth: 2,
                          borderColor: active
                            ? 'var(--mantine-color-pri-6)'
                            : 'var(--mantine-color-dark-6)',
                        }}
                        onClick={() => {
                          setSelectedVariantId(vi.value as string);
                          const variant = productVariantsCurrent.find((va) => va.id == vi.value);
                          if (variant && variant.price) setPrice(variant.price);
                        }}
                      >
                        <Stack align="center" ta={'center'} gap={0}>
                          <Text fz={'xs'} fw={500}>
                            {vi.label}
                          </Text>

                          <Text inherit fz={'sm'} fw={'bold'}>
                            <NumberFormatter value={vi.price} />
                            /-
                          </Text>
                        </Stack>
                      </Card>
                    );
                  })}
                </Group>
              )}
            </Box>
          )}

          <Stack mt={options?.small ? 'x' : 'md'}>
            <Group justify="space-between">
              <Text fz={options?.small ? 'xs' : 'sm'}>
                Kshs.{' '}
                <Text
                  component="span"
                  inherit
                  fz={options?.small ? 'sm' : 'xl'}
                  fw={'bold'}
                  c={options?.small ? 'dark.1' : 'white'}
                >
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
                    `Add`
                  )
                }
              >
                <Group gap={'xs'}>
                  {!isOrder || options?.small ? (
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE}
                      // variant={inCart ? 'light' : 'subtle'}
                      color={inCart ? 'ter' : 'pri'}
                      onClick={handleAddCart}
                    >
                      {inCart ? (
                        <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                      ) : (
                        <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                      )}
                    </ActionIcon>
                  ) : (
                    <Group>
                      <Button
                        fullWidth
                        size="sm"
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
                        {'Add'}
                      </Button>
                    </Group>
                  )}
                </Group>
              </Tooltip>
            </Group>
          </Stack>
        </div>
      </Stack>
    </Card>
  );
}
