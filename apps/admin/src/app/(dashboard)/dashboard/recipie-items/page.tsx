import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardRecipieItems from '@admin/ui/partial/page/dashboard/recipie-items';

export const metadata: Metadata = { title: 'RecipieItems' };

export default function RecipieItems() {
  return (
    <div>
      <PartialPageAdminDashboardRecipieItems />
    </div>
  );
}
