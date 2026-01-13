import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardSides from '@/components/partial/page/dashboard/sides';

export const metadata: Metadata = { title: 'Sides' };

export default function Sides() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardSides />
    </LayoutPage>
  );
}
