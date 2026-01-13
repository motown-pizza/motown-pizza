import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardPizzas from '@/components/partial/page/dashboard/pizzas';

export const metadata: Metadata = { title: 'Pizzas' };

export default function Pizzas() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardPizzas />
    </LayoutPage>
  );
}
