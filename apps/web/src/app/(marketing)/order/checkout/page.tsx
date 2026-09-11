import React from 'react';
import { Metadata } from 'next';
import PartialOrderCheckout from '@web/ui/partial/page/order/checkout';

export const metadata: Metadata = { title: 'Checkout' };

export default function Checkout() {
  return (
    <div>
      <PartialOrderCheckout />
    </div>
  );
}
