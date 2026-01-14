'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Loader,
  NumberFormatter,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useStoreCartItem } from '@repo/libraries/zustand/stores/cart-item';
import CardMenuCart from '../cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useGetSum } from '@/hooks/order';

export default function Cart({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { cartItems } = useStoreCartItem();
  const { getSum } = useGetSum();

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Cart"
        position="right"
        styles={{
          header: { padding: 'var(--mantine-spacing-xs)' },
          body: { padding: 0 },
        }}
      >
        <Divider />

        {cartItems === undefined ? (
          <Center py={SECTION_SPACING}>
            <Loader size={'sm'} />
          </Center>
        ) : cartItems?.length == 0 ? (
          <Center py={SECTION_SPACING}>
            <Text c={'dimmed'}>Cart Empty</Text>
          </Center>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 61px)',
            }}
          >
            <ScrollArea
              scrollbars={'y'}
              style={{
                flex: 1,
                overflowY: 'auto',
              }}
            >
              {sortArray(
                cartItems || [],
                (i) => i.created_at,
                Order.ASCENDING
              ).map((ci, i) => (
                <Stack key={i} gap={5}>
                  {i > 0 && <Divider mt={5} w={'95%'} mx={'auto'} />}

                  <CardMenuCart props={ci} />
                </Stack>
              ))}
            </ScrollArea>

            <div>
              <Divider />

              <Stack gap={'xs'} p={'xs'}>
                <div>
                  <Group justify="space-between" align="start">
                    <Title order={4} fz={'md'} c={'blue.6'}>
                      Subtotal:
                    </Title>

                    <Text inherit fz={'sm'}>
                      Kshs.{' '}
                      <Text
                        component="span"
                        inherit
                        fz={'md'}
                        fw={500}
                        c={'sec'}
                      >
                        <NumberFormatter value={getSum()} />
                      </Text>
                    </Text>
                  </Group>

                  <Text fz={'sm'} c={'dimmed'}>
                    Delivery fee not included
                  </Text>
                </div>

                <Group justify="end">
                  <NextLink href={`/order/checkout-review`}>
                    <Button size="xs" onClick={close}>
                      Checkout
                    </Button>
                  </NextLink>
                </Group>
              </Stack>
            </div>
          </div>
        )}
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}
