'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
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
import { useStoreCartItem } from '@repo/store';
import CardMenuCart from '../cards/menu/cart';
import { SECTION_SPACING } from '@repo/constants';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import { AnchorNextLink } from '@repo/ui';
import { useGetSum } from '@repo/hooks';

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
        ) : (
          <div>
            <ScrollArea h={`calc(100vh - ${60 + 1 + 1}px)`} scrollbars={'y'}>
              <Box
                bg={'var(--mantine-color-body)'}
                style={{ position: 'sticky', top: -1, zIndex: 1 }}
              >
                <Stack gap={'xs'} p={'xs'}>
                  <div>
                    <Group justify="space-between" align="end">
                      <Title order={4} fz={'md'} c={'sec'}>
                        Total:
                      </Title>

                      <Text inherit fz={'sm'}>
                        Kshs.{' '}
                        <Text component="span" inherit fz={'lg'} fw={500} c={'white'}>
                          <NumberFormatter value={getSum()} />
                        </Text>
                      </Text>
                    </Group>

                    <Text fz={'sm'} c={'dark.1'} fw={500}>
                      Inc. VAT & delivery
                    </Text>
                  </div>

                  <Group justify="end">
                    <AnchorNextLink href={`/order/checkout-review`}>
                      <Button size="sm" onClick={close}>
                        Checkout
                      </Button>
                    </AnchorNextLink>
                  </Group>
                </Stack>

                <Divider />
              </Box>

              <Stack>
                {!cartItems?.length ? (
                  <Center py={SECTION_SPACING}>
                    <Text c={'dimmed'}>Cart Empty</Text>
                  </Center>
                ) : (
                  <div>
                    {sortArray(cartItems || [], (i) => i.createdAt, Order.ASCENDING).map(
                      (ci, i) => (
                        <Stack key={i} gap={5}>
                          {i > 0 && <Divider mt={5} w={'95%'} mx={'auto'} />}

                          <CardMenuCart props={ci} />
                        </Stack>
                      ),
                    )}
                  </div>
                )}
              </Stack>
            </ScrollArea>
          </div>
        )}
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}
