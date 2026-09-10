import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardDeliveries from '@admin/ui/partial/page/dashboard/deliveries';

export const metadata: Metadata = { title: 'Deliveries' };

export default function Deliveries() {
  return (
    <div>
      <PartialPageAdminDashboardDeliveries />
    </div>
  );
}
