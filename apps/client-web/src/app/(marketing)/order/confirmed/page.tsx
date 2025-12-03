import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialOrderPageConfirmed from '@/components/partial/page/order/confirmed';

export const metadata: Metadata = { title: 'Order Confirmed' };

export default function OrderConfirmed() {
  return (
    <LayoutPage>
      <PartialOrderPageConfirmed />
    </LayoutPage>
  );
}
