import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAdminDashboardAdmins from '@/components/partial/page/dashboard/admins';

export const metadata: Metadata = { title: 'Admins' };

export default function Admins() {
  return (
    <LayoutPage>
      <PartialPageAdminDashboardAdmins />
    </LayoutPage>
  );
}
