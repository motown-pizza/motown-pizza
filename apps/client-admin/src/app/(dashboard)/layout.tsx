/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import LayoutShellDashboard from '@/components/layout/shell/dashboard';
import { APP_NAME } from '@/data/constants';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: `%s - Dashboard - ${APP_NAME}`,
  },
};

export default async function LayoutDashboard({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutShellDashboard>{children}</LayoutShellDashboard>
    </LayoutBody>
  );
}
