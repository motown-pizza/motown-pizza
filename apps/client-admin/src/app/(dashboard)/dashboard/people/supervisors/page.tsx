import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardSupervisors from '@/components/partial/page/dashboard/supervisors';

export const metadata: Metadata = { title: 'Supervisors' };

export default function Supervisors() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardSupervisors />
    </LayoutPage>
  );
}
