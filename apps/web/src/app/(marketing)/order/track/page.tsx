import React from 'react';
import { Metadata } from 'next';
import PartialOrderTrack from '@web/ui/partial/page/order/track';

export const metadata: Metadata = { title: 'Track Order' };

export default function TrackOrder() {
  return (
    <div>
      <PartialOrderTrack />
    </div>
  );
}
