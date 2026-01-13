import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardTransporters from '@/components/partial/page/dashboard/transporters';

export const metadata: Metadata = { title: 'Transporters' };

export default function Transporters() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardTransporters />
    </LayoutPage>
  );
}
