import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialOrderTrack from '@/components/partial/page/order/track';

export const metadata: Metadata = { title: 'Track Order' };

export default function TrackOrder() {
  return (
    <LayoutPage>
      <PartialOrderTrack />
    </LayoutPage>
  );
}
