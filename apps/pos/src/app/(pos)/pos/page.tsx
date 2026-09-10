import React from 'react';
import { Metadata } from 'next';
import PartialPagePosHome from '@pos/ui/partial/page/pos/home';

export const metadata: Metadata = { title: 'Home' };

export default function Home() {
  return (
    <div>
      <PartialPagePosHome />
    </div>
  );
}
