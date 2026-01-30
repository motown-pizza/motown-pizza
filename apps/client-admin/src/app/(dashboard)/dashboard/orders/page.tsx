import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardOrders from '@/components/partial/page/dashboard/orders';

export const metadata: Metadata = { title: 'Orders' };

export default function Orders() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardOrders />
    </LayoutPage>
  );
}
