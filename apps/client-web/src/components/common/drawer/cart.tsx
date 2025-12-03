'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Divider, Drawer, Loader, Stack, Text } from '@mantine/core';
import { useStoreCart } from '@/libraries/zustand/stores/cart';
import CardMenuCart from '../cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Cart({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  const { cart } = useStoreCart();

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Cart" position="right">
        {cart === undefined ? (
          <Center py={SECTION_SPACING}>
            <Loader size={'sm'} />
          </Center>
        ) : cart?.length == 0 ? (
          <Center py={SECTION_SPACING}>
            <Text c={'dimmed'}>Cart Empty</Text>
          </Center>
        ) : (
          cart?.map((ci, i) => (
            <Stack key={i} gap={5}>
              {i > 0 && <Divider mt={5} />}

              <CardMenuCart props={ci} />
            </Stack>
          ))
        )}
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}
