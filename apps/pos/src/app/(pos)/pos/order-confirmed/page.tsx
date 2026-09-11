import React from 'react';
import { Metadata } from 'next';
import PartialPagePosOrderConfirmed from '@pos/ui/partial/page/pos/order-confirmed';

export const metadata: Metadata = { title: 'Order Confirmed' };

export default function OrderConfirmed() {
  return (
    <div>
      <PartialPagePosOrderConfirmed />
    </div>
  );
}
