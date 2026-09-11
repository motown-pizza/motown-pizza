import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardOrders from '@admin/ui/partial/page/dashboard/orders';

export const metadata: Metadata = { title: 'Orders' };

export default function Orders() {
  return (
    <div>
      <PartialPageAdminDashboardOrders />
    </div>
  );
}
