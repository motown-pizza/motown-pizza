import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPagePosOrders from '@/components/partial/page/pos/orders';

export const metadata: Metadata = { title: 'Orders' };

export default function Orders() {
  return (
    <LayoutPage>
      <PartialPagePosOrders />
    </LayoutPage>
  );
}
