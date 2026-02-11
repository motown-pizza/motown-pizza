import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardStockMovements from '@/components/partial/page/dashboard/stock-movements';

export const metadata: Metadata = { title: 'Stock Movements' };

export default function Stock() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardStockMovements />
    </LayoutPage>
  );
}
