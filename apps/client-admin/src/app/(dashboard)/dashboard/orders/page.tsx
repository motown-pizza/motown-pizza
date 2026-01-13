import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = { title: 'Orders' };

export default function Orders() {
  return (
    <LayoutPage>
      <div>Orders</div>
    </LayoutPage>
  );
}
