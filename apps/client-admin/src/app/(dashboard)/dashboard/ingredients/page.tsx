import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardIngredients from '@/components/partial/page/dashboard/ingredients';

export const metadata: Metadata = { title: 'Ingredients' };

export default function Ingredients() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardIngredients />
    </LayoutPage>
  );
}
