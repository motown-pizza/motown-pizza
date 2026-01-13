'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Divider, Drawer, Loader, Stack, Text } from '@mantine/core';
import { useStoreCartItems } from '@/libraries/zustand/stores/cart';
import CardMenuCart from '../cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Cart({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  const { cartItems } = useStoreCartItems();

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Cart" position="right">
        {cartItems === undefined ? (
          <Center py={SECTION_SPACING}>
            <Loader size={'sm'} />
          </Center>
        ) : cartItems?.length == 0 ? (
          <Center py={SECTION_SPACING}>
            <Text c={'dimmed'}>Cart Empty</Text>
          </Center>
        ) : (
          cartItems?.map((ci, i) => (
            <Stack key={i} gap={5}>
              {i > 0 && <Divider mt={5} />}

              {/* <CardMenuCart props={ci} /> */}
            </Stack>
          ))
        )}
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}
