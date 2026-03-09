/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import PartialFooterDashboard from '@/components/partial/footer/dashboard';
import PartialPageLayoutDashboard from '@/components/partial/page/layout/dashboard';

export default async function LayoutDashboard({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <PartialPageLayoutDashboard>{children}</PartialPageLayoutDashboard>
      <PartialFooterDashboard />
    </LayoutBody>
  );
}
