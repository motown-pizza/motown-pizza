'use client';

import {
  Affix,
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Transition,
} from '@mantine/core';
import { useGetSum } from '@repo/hooks';
import { useStoreCartItem, useStoreOrderPlacement } from '@repo/store';
import { IconShoppingCart } from '@tabler/icons-react';
import { ICON_SIZE } from '@repo/constants';
import { usePathname } from 'next/navigation';
import { AnchorNextLink } from '@repo/ui';
import { OrderPaymentMethod } from '@repo/types';

export default function AffixCheckout() {
  const pathname = usePathname();
  const mounted = pathname.includes('/order/checkout');

  return (
    <>
      <Affix position={{ bottom: 0, left: 0, right: 0 }}>
        <Transition transition="slide-up" mounted={mounted}>
          {(transitionStyles) => (
            <Box style={transitionStyles}>
              <Divider />
              <CardAffixMenu />
            </Box>
          )}
        </Transition>
      </Affix>
    </>
  );
}

function CardAffixMenu() {
  const { cartItems } = useStoreCartItem();
  const { getSum } = useGetSum();
  const { orderDetails } = useStoreOrderPlacement();

  return (
    <Card bg={'black'} p={{ base: 8, xs: 'md' }} pl={{ base: 'sm', xs: 'md' }} radius={0}>
      <Group justify="space-between" wrap="nowrap" c={'white'} fw={'bold'}>
        <Stack gap={0} hiddenFrom="xs">
          <Text inherit fz={'sm'} c={'dimmed'}>
            Total incl. delivery
          </Text>

          <Text inherit fz={'lg'} fw={'bold'}>
            Kshs. <NumberFormatter value={getSum()} />
          </Text>
        </Stack>

        <Group w={{ xs: '33%' }} justify="end">
          <Button component={AnchorNextLink} href="/order/checkout" size="md">
            Pay ({orderDetails?.paymentMethod == OrderPaymentMethod.ONLINE ? 'M-Pesa' : 'Cash'})
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
