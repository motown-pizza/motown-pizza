import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardSides from '@admin/ui/partial/page/dashboard/sides';

export const metadata: Metadata = { title: 'Sides' };

export default function Sides() {
  return (
    <div>
      <PartialPageAdminDashboardSides />
    </div>
  );
}
