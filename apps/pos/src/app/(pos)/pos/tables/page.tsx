import React from 'react';
import { Metadata } from 'next';
import PartialPagePosTables from '@pos/ui/partial/page/pos/tables';

export const metadata: Metadata = { title: 'Tables' };

export default function Tables() {
  return (
    <div>
      <PartialPagePosTables />
    </div>
  );
}
