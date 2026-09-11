import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardPizzas from '@admin/ui/partial/page/dashboard/pizzas';

export const metadata: Metadata = { title: 'Pizzas' };

export default function Pizzas() {
  return (
    <div>
      <PartialPageAdminDashboardPizzas />
    </div>
  );
}
