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
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreCart } from '@/libraries/zustand/stores/cart';
import { SyncStatus } from '@repo/types/models/enums';
import { usePathname } from 'next/navigation';
import { useStoreOrderDetails } from '@/libraries/zustand/stores/order-details';
import { defaultOrderDetails } from '@/data/orders';
import { useStoreVariant } from '@/libraries/zustand/stores/variant';

export default function Main({
  props,
  options,
}: {
  props: ProductGet;
  options?: { small?: boolean };
}) {
  const [variant, setVariant] = useState('');
  const [price, setPrice] = useState(0);
  const pathname = usePathname();
  const { orderDetails, setOrderDetails } = useStoreOrderDetails();

  const { cart, setCart } = useStoreCart();

  const { variants } = useStoreVariant();
  const productVariants = (variants || []).filter(
    (v) => v.product_id == props.id
  );

  useEffect(() => {
    if (!variant && productVariants.length) {
      const variant = productVariants[0];

      setVariant(variant.id);
      if (variant.price) setPrice(variant.price);
    }
  }, [variants, productVariants]);

  const inCart = cart?.find((ci) => ci.id == `${props.id}-${variant}`);
  const isInOrder = orderDetails?.products.find(
    (p) => p.id == `${props.id}-${variant}`
  );

  const handleAddCart = () => {
    if (inCart) {
      setCart(
        (cart || []).map((ci) => {
          if (ci.id != `${props.id}-${variant}`) return ci;

          return {
            ...ci,
            selected_variant_id: variant,
            quantity: (ci.quantity || 0) + 1,
            sync_status: SyncStatus.PENDING,
          };
        })
      );
    } else {
      setCart([
        ...(cart || []),
        {
          ...props,
          id: `${props.id}-${variant}`,
          selected_variant_id: variant,
          quantity: 1,
          sync_status: SyncStatus.PENDING,
        },
      ]);
    }
  };

  const handleAddOrder = () => {
    if (isInOrder) {
      setOrderDetails({
        ...(orderDetails || defaultOrderDetails),
        products: (orderDetails || defaultOrderDetails).products.map((ci) => {
          if (ci.id != `${props.id}-${variant}`) return ci;

          return {
            ...ci,
            selected_variant_id: variant,
            quantity: (ci.quantity || 0) + 1,
          };
        }),
      });
    } else {
      setOrderDetails({
        ...(orderDetails || defaultOrderDetails),
        products: [
          ...(orderDetails || defaultOrderDetails).products,
          {
            ...props,
            id: `${props.id}-${variant}`,
            selected_variant_id: variant,
            quantity: 1,
          },
        ],
      });
    }
  };

  const external = props.image.includes('https');
  const drink = props.image.includes('drink');
  const isOrder = pathname.includes('order');

  return (
    <Card
      radius={'lg'}
      h={'100%'}
      bg={'var(--mantine-color-dark-8)'}
      withBorder
    >
      <Stack h={'100%'} justify="space-between">
        <div>
          <CardSection
            bg={'var(--mantine-color-dark-7)'}
            py={external || drink ? undefined : 'xl'}
          >
            <ImageDefault
              src={props.image}
              alt={props.title}
              height={{
                base:
                  external || drink
                    ? options?.small
                      ? 200
                      : 300
                    : options?.small
                      ? 100
                      : 200,
              }}
              fit={external || drink ? undefined : 'contain'}
            />
          </CardSection>

          <Stack mt={'md'}>
            <Title order={3} fz={'md'} fw={500} c={'sec.6'}>
              {props.title}
            </Title>

            {props.ingredients && <Text fz={'sm'}>{props.ingredients}</Text>}
          </Stack>
        </div>

        <div>
          <Group>
            {productVariants && (
              <Select
                w={'100%'}
                placeholder="Pick size"
                radius={'lg'}
                size="xs"
                checkIconPosition="right"
                allowDeselect={false}
                data={productVariants.map((s) => ({
                  value: s.id,
                  label: capitalizeWords(s.size),
                }))}
                value={variant}
                onChange={(v) => {
                  setVariant(v as string);
                  const variant = productVariants.find((va) => va.id == v);
                  if (variant && variant.price) setPrice(variant.price);
                }}
              />
            )}
          </Group>

          <Divider mt={'xs'} />

          <Stack>
            <Group justify="space-between" mt={'xs'}>
              <Text fz={'sm'}>
                Kshs.{' '}
                <Text component="span" inherit fz={'md'} fw={'bold'}>
                  <NumberFormatter value={price} />
                </Text>
              </Text>

              <Group gap={'xs'}>
                <Tooltip
                  label={
                    inCart ? (
                      <Text component="span" inherit>
                        <NumberFormatter value={inCart.quantity || 0} /> in cart
                      </Text>
                    ) : (
                      'Add to cart'
                    )
                  }
                >
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE}
                    variant={inCart ? 'filled' : 'subtle'}
                    color="ter.6"
                    onClick={handleAddCart}
                  >
                    <IconShoppingCart
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            {isOrder && (
              <Group>
                <Button
                  fullWidth
                  color={isInOrder ? 'ter' : 'pri'}
                  onClick={handleAddOrder}
                  rightSection={
                    !isInOrder ? undefined : !orderDetails ? undefined : (
                      <Text component="span" inherit fz={'normal'}>
                        (
                        <NumberFormatter
                          value={
                            orderDetails.products.find(
                              (p) => p.id == `${props.id}-${variant}`
                            )?.quantity || 0
                          }
                        />
                        )
                      </Text>
                    )
                  }
                >
                  {isInOrder ? 'Added' : 'Add'} to Order
                </Button>
              </Group>
            )}
          </Stack>
        </div>
      </Stack>
    </Card>
  );
}
