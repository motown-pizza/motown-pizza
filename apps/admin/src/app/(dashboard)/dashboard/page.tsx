import React from 'react';
import { Metadata } from 'next';
import PartialPageDashboardOverview from '@admin/ui/partial/page/dashboard/overview';

export const metadata: Metadata = { title: 'Overview' };

export default function Overview() {
  return (
    <div>
      <PartialPageDashboardOverview />
    </div>
  );
}
