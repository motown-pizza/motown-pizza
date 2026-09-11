import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardUsers from '@admin/ui/partial/page/dashboard/users';

export const metadata: Metadata = { title: 'Customers' };

export default function Clients() {
  return (
    <div>
      <PartialPageAdminDashboardUsers />
    </div>
  );
}
