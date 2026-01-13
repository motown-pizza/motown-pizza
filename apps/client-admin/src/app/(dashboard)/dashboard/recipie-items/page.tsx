import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardRecipieItems from '@/components/partial/page/dashboard/recipie-items';

export const metadata: Metadata = { title: 'RecipieItems' };

export default function RecipieItems() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardRecipieItems />
    </LayoutPage>
  );
}
