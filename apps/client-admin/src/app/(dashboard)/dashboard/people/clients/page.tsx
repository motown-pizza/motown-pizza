import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardUsers from '@/components/partial/page/dashboard/users';

export const metadata: Metadata = { title: 'Customers' };

export default function Clients() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardUsers />
    </LayoutPage>
  );
}
