import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageDashboardOverview from '@/components/partial/page/dashboard/overview';

export const metadata: Metadata = { title: 'Overview' };

export default function Overview() {
  return (
    <LayoutPage>
      <PartialPageDashboardOverview />
    </LayoutPage>
  );
}
