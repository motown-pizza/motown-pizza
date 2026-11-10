import React, { useEffect, useState } from 'react';
import { ProductDietaryType, ProductGet, Variant } from '@repo/types';
import { useNotification } from '@repo/notifications';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Collapse,
  Divider,
  Flex,
  Group,
  NumberFormatter,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { ImageDefault } from '@repo/ui';
import { TagBadge } from '@web/ui/common/badges/tag';
import { getManualTags } from '@web/data/menu-tags';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconShoppingCart,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreProductVariant } from '@repo/store';
import { useStoreCartItem } from '@repo/store';
import { useCartItemActions } from '@repo/store';
import { capitalizeWords, sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import { useStoreRecipieItem } from '@repo/store';
import { useStoreIngredient } from '@repo/store';
import CustomisePizza from '@web/ui/common/modals/customise-pizza';

export default function Main({
  props,
  options,
}: {
  props: ProductGet;
  options?: { small?: boolean };
}) {
  const [variantId, setSelectedVariantId] = useState('');
  const [price, setPrice] = useState(0);
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [customiseOpened, setCustomiseOpened] = useState(false);

  const pathname = usePathname();
  const { showNotification } = useNotification();
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
    showNotification({
      title: 'Added to cart',
      desc: `${props.title} added to your cart`,
      variant: Variant.SUCCESS, // Use the success variant
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
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
  const manualTags = getManualTags(props.title);

  return (
    <Card radius={'lg'} h={'100%'} bg={'var(--mantine-color-dark-9)'} withBorder pt={0}>
      <Flex direction="column" h="100%" justify="space-between">
        <Flex direction="column" h="100%">
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
            <Group gap="xs" mb="xs">
              {manualTags.map((tag, index) => (
                <TagBadge key={`${tag}-${index}`} type={tag} label={tag} />
              ))}
              {(props.dietaryClass === ProductDietaryType.VEGGIE ||
                props.dietaryClass === ProductDietaryType.VEGAN) && (
                <TagBadge type="veg" label="Veg" />
              )}
            </Group>
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
                <Text
                  fz="sm"
                  c="dark.1"
                  lineClamp={!showFullIngredients ? 2 : undefined}
                >
                  {props.description || content}
                </Text>
                <UnstyledButton
                  c="sec"
                  fz="xs"
                  fw={500}
                  onClick={() => setShowFullIngredients((current) => !current)}
                >
                  <Group gap={4}>
                    {showFullIngredients ? (
                      <>
                        Hide ingredients
                        <IconChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Full ingredients
                        <IconChevronDown size={14} />
                      </>
                    )}
                  </Group>
                </UnstyledButton>
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

                          {productVariantsArray.length > 1 && (
                            <Text inherit fz={'sm'} fw={'bold'}>
                              <NumberFormatter value={vi.price} />
                              /-
                            </Text>
                          )}
                        </Stack>
                      </Card>
                    );
                  })}
                </Group>
              )}
            </Box>
          )}

          <Stack mt="auto" pt="md">
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
                    <>
                      <UnstyledButton
                        fz="xs"
                        c="dimmed"
                        td="underline"
                        onClick={() => setCustomiseOpened(true)}
                      >
                        Customise
                      </UnstyledButton>
                      <Group>
                        <Button
                          fullWidth
                          size="sm"
                          onClick={handleAddCart}
                          color={isAdded ? 'ter' : 'pri'}
                          rightSection={
                            isAdded ? (
                              <Group gap={4}>
                                <Text inherit fw={500} fz="sm">
                                  Added
                                </Text>
                                <IconCheck size={16} />
                              </Group>
                            ) : (
                              (cartItems?.find((ci) => ci.productVariantId == variantId)?.quantity ??
                                0) > 0 && (
                                <Badge size="sm" variant="white" color="dark" circle>
                                  <NumberFormatter
                                    value={
                                      cartItems?.find((ci) => ci.productVariantId == variantId)
                                        ?.quantity || 0
                                    }
                                  />
                                </Badge>
                              )
                            )
                          }
                        >
                          {'Add'}
                        </Button>
                      </Group>
                    </>
                  )}
                </Group>
              </Tooltip>
            </Group>
          </Stack>
        </Flex>
      </Flex>

      <CustomisePizza
        opened={customiseOpened}
        onClose={() => setCustomiseOpened(false)}
        productTitle={props.title}
        price={price}
      />
    </Card>
  );
}
