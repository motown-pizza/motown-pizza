import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardTransporters from '@admin/ui/partial/page/dashboard/transporters';

export const metadata: Metadata = { title: 'Couriers' };

export default function Transporters() {
  return (
    <div>
      <PartialPageAdminDashboardTransporters />
    </div>
  );
}
