import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardDrinks from '@admin/ui/partial/page/dashboard/drinks';

export const metadata: Metadata = { title: 'Drinks' };

export default function Drinks() {
  return (
    <div>
      <PartialPageAdminDashboardDrinks />
    </div>
  );
}
