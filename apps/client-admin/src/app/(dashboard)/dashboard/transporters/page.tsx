import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = { title: 'Transporters' };

export default function Transporters() {
  return (
    <LayoutPage>
      <div>Transporters</div>
    </LayoutPage>
  );
}
