import React from 'react';
import { Metadata } from 'next';
import PartialOrderPageConfirmed from '@web/ui/partial/page/order/confirmed';

export const metadata: Metadata = { title: 'Order Confirmed' };

export default function OrderConfirmed() {
  return (
    <div>
      <PartialOrderPageConfirmed />
    </div>
  );
}
