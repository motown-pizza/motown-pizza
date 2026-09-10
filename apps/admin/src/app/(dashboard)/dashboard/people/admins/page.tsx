import React from 'react';
import { Metadata } from 'next';
import PartialPageAdminDashboardAdmins from '@admin/ui/partial/page/dashboard/admins';

export const metadata: Metadata = { title: 'Admins' };

export default function Admins() {
  return (
    <div>
      <PartialPageAdminDashboardAdmins />
    </div>
  );
}
