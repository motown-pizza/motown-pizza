import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialOrderCheckout from '@/components/partial/page/order/checkout';

export const metadata: Metadata = { title: 'Checkout' };

export default function Checkout() {
  return (
    <LayoutPage>
      <PartialOrderCheckout />
    </LayoutPage>
  );
}
