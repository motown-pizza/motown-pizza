import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardStaff from '@/components/partial/page/dashboard/staff';

export const metadata: Metadata = { title: 'Staff' };

export default function Staff() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardStaff />
    </LayoutPage>
  );
}
