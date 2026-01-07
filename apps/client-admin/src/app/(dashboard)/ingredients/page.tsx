import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = { title: 'Ingredients' };

export default function Ingredients() {
  return (
    <LayoutPage>
      <div>Ingredients</div>
    </LayoutPage>
  );
}
