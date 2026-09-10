import React from 'react';
import { Metadata } from 'next';
import PartialPagePosOrders from '@pos/ui/partial/page/pos/orders';

export const metadata: Metadata = { title: 'Orders' };

export default function Orders() {
  return (
    <div>
      <PartialPagePosOrders />
    </div>
  );
}
