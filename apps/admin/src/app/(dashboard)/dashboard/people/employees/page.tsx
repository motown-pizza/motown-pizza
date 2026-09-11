import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardEmployees from '@admin/ui/partial/page/dashboard/employees';

export const metadata: Metadata = { title: 'Employees' };

export default function Employees() {
  return (
    <div>
      <PartialPageAdminDashboardEmployees />
    </div>
  );
}
