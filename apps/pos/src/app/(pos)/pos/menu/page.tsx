import React from 'react';
import { Metadata } from 'next';
import PartialPagePosMenu from '@pos/ui/partial/page/pos/menu';

export const metadata: Metadata = { title: 'Menu' };

export default function Menu() {
  return (
    <div>
      <PartialPagePosMenu />
    </div>
  );
}
