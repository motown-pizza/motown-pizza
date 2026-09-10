import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardStock from '@admin/ui/partial/page/dashboard/stock';

export const metadata: Metadata = { title: 'Stock' };

export default function Stock() {
  return (
    <div>
      <PartialPageAdminDashboardStock />
    </div>
  );
}
