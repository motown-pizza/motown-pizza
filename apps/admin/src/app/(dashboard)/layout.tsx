import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
import LayoutShellDashboard from '@admin/ui/layout/shell/dashboard';
import { APP_NAME } from '@repo/constants';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: `%s - Dashboard - ${APP_NAME.ADMIN}`,
  },
};

export default async function LayoutDashboard({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain>
      <LayoutShellDashboard>{children}</LayoutShellDashboard>
    </LayoutMain>
  );
}
