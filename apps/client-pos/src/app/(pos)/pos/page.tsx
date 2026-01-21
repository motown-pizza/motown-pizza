import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPagePosHome from '@/components/partial/page/pos/home';

export const metadata: Metadata = { title: 'Home' };

export default function Home() {
  return (
    <LayoutPage>
      <PartialPagePosHome />
    </LayoutPage>
  );
}
