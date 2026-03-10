import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardEmployees from '@/components/partial/page/dashboard/employees';

export const metadata: Metadata = { title: 'Employees' };

export default function Employees() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardEmployees />
    </LayoutPage>
  );
}
