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
import {
  useOrderActions,
  useStoreCartItem,
  useStoreOrderPlacement,
  useStoreProfile,
  useStoreSession,
} from '@repo/store';
import CardMenuCart from '../cards/menu/cart';
import { defaultOrderDetails, SECTION_SPACING, stores } from '@repo/constants';
import { generateUUID, sortArray } from '@repo/utils';
import { Order, OrderFulfilmentType, OrderGet } from '@repo/types';
import { AnchorNextLink } from '@repo/ui';
import { useGetSum } from '@repo/hooks';

export default function Cart({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  const session = useStoreSession((s) => s.session);
  const profiles = useStoreProfile((s) => s.profiles);
  const currentProfile = profiles?.find((pi) => pi.id == session?.id);
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  const handleStartOrder = (fulfillmentType: OrderFulfilmentType) => {
    const newOrderId = generateUUID();
    const fullName = `${currentProfile?.firstName || ''} ${currentProfile?.lastName || ''}`.trim();
    const newOrder: OrderGet = {
      ...defaultOrderDetails,
      id: newOrderId,
      customerName: fullName,
      fulfillmentType,
    };

    orderCreate(newOrder, { stores: stores });
    setOrderDetails(newOrder);
  };

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
            <ScrollArea h={`calc(90vh - ${60 + 1 + 1}px)`} scrollbars={'y'}>
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

              <Box
                bg={'var(--mantine-color-body)'}
                style={{ position: 'sticky', bottom: 0, zIndex: 1 }}
              >
                <Divider />
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
                    <Button
                      component={AnchorNextLink}
                      href={`/order/checkout`}
                      size="sm"
                      disabled={!cartItems?.length}
                      onClick={() => {
                        close();
                        if (!orderDetails) handleStartOrder(OrderFulfilmentType.DELIVERY);
                      }}
                    >
                      Checkout
                    </Button>
                  </Group>
                </Stack>
              </Box>
            </ScrollArea>
          </div>
        )}
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}
