import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardDrinks from '@/components/partial/page/dashboard/drinks';

export const metadata: Metadata = { title: 'Drinks' };

export default function Drinks() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardDrinks />
    </LayoutPage>
  );
}
