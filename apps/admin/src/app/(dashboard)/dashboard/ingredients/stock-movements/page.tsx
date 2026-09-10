import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardStockMovements from '@admin/ui/partial/page/dashboard/stock-movements';

export const metadata: Metadata = { title: 'Stock Movements' };

export default function Stock() {
  return (
    <div>
      <PartialPageAdminDashboardStockMovements />
    </div>
  );
}
