import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import { typeParams } from '../layout';
import PartialPageDetailsProduct from '@/components/partial/page/details/product';

export default async function Product({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const productId = (await params).productId;

  return (
    <LayoutPage>
      <PartialPageDetailsProduct props={{ itemId: productId }} />
    </LayoutPage>
  );
}
