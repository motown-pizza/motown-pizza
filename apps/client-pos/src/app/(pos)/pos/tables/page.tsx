import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPagePosTables from '@/components/partial/page/pos/tables';

export const metadata: Metadata = { title: 'Tables' };

export default function Tables() {
  return (
    <LayoutPage>
      <PartialPagePosTables />
    </LayoutPage>
  );
}
