'use client';

import {
  Affix,
  Box,
  Button,
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Transition,
} from '@mantine/core';
import { useGetSum } from '@repo/hooks';
import {
  useOrderActions,
  useStoreCartItem,
  useStoreOrderPlacement,
  useStoreProfile,
  useStoreSession,
} from '@repo/store';
import { IconShoppingCart } from '@tabler/icons-react';
import { defaultOrderDetails, ICON_SIZE, stores } from '@repo/constants';
import { usePathname } from 'next/navigation';
import { AnchorNextLink } from '@repo/ui';
import { OrderFulfilmentType, OrderGet } from '@repo/types';
import { generateUUID } from '@repo/utils';

export default function AffixMenu() {
  const pathname = usePathname();
  const { cartItems } = useStoreCartItem();
  if (!cartItems || cartItems.length === 0) return null;

  const mounted = pathname.includes('/order/select-menu');

  return (
    <>
      <Affix
        position={{ bottom: 16, left: 0, right: 0 }}
        w={{ base: '90%', md: '50%', lg: '40%' }}
        style={{ zIndex: 10 }}
        mx={'auto'}
      >
        <Transition transition="slide-up" mounted={mounted}>
          {(transitionStyles) => (
            <Box style={transitionStyles}>
              <CardAffixMenu />
            </Box>
          )}
        </Transition>
      </Affix>
    </>
  );
}

function CardAffixMenu() {
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
    <Card bg={'pri'} p={{ base: 8, xs: 'md' }} pl={{ base: 'sm', xs: 'md' }}>
      <Group justify="space-between" wrap="nowrap" c={'white'} fw={'bold'}>
        <Stack gap={0} hiddenFrom="xs">
          <Text inherit fz={'sm'}>
            {cartItems?.length} item(s)
          </Text>

          <Text inherit fz={'md'} fw={'bold'} lh={1.1}>
            Kshs. <NumberFormatter value={getSum()} />
          </Text>
        </Stack>

        <Group w={'33%'} gap={'xs'} visibleFrom="xs">
          <Box visibleFrom="xs">
            <IconShoppingCart size={ICON_SIZE} stroke={2} />
          </Box>
          <Text inherit fz={'md'}>
            {cartItems?.length} item(s)
          </Text>
        </Group>

        <Group w={'33%'} justify="center" ta={'center'} visibleFrom="xs">
          <Text inherit fz={'lg'} fw={'bold'}>
            Kshs. <NumberFormatter value={getSum()} />
          </Text>
        </Group>

        <Group w={{ xs: '33%' }} justify="end">
          <Button
            color="dark"
            component={AnchorNextLink}
            href="/order/checkout"
            size="md"
            disabled={!cartItems?.length}
            onClick={() => {
              if (!orderDetails) handleStartOrder(OrderFulfilmentType.DELIVERY);
            }}
          >
            Checkout
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
