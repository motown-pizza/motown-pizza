import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPagePosMenu from '@/components/partial/page/pos/menu';

export const metadata: Metadata = { title: 'Menu' };

export default function Menu() {
  return (
    <LayoutPage>
      <PartialPagePosMenu />
    </LayoutPage>
  );
}
