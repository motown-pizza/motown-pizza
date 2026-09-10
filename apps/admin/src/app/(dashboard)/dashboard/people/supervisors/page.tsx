import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardSupervisors from '@admin/ui/partial/page/dashboard/supervisors';

export const metadata: Metadata = { title: 'Supervisors' };

export default function Supervisors() {
  return (
    <div>
      <PartialPageAdminDashboardSupervisors />
    </div>
  );
}
