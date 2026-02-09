import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardStock from '@/components/partial/page/dashboard/stock';

export const metadata: Metadata = { title: 'Stock' };

export default function Stock() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardStock />
    </LayoutPage>
  );
}
