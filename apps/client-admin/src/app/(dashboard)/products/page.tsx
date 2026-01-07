import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = { title: 'Products' };

export default function Products() {
  return (
    <LayoutPage>
      <div>Products</div>
    </LayoutPage>
  );
}
