import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardDeliveries from '@/components/partial/page/dashboard/deliveries';

export const metadata: Metadata = { title: 'Deliveries' };

export default function Deliveries() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardDeliveries />
    </LayoutPage>
  );
}
