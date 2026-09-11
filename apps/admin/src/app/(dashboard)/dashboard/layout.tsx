import React from 'react';
import { LayoutMain } from '@repo/ui';
import PartialFooterDashboard from '@admin/ui/partial/footer/dashboard';
import PartialPageLayoutDashboard from '@admin/ui/partial/page/layout/dashboard';

export default async function LayoutDashboard({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain>
      <PartialPageLayoutDashboard>{children}</PartialPageLayoutDashboard>
      <PartialFooterDashboard />
    </LayoutMain>
  );
}
