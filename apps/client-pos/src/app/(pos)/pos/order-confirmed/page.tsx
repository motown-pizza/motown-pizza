import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPagePosOrderConfirmed from '@/components/partial/page/pos/order-confirmed';

export const metadata: Metadata = { title: 'Order Confirmed' };

export default function OrderConfirmed() {
  return (
    <LayoutPage>
      <PartialPagePosOrderConfirmed />
    </LayoutPage>
  );
}
