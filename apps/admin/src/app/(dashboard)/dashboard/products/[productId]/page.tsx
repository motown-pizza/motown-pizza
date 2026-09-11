import React from 'react';
import { typeParams } from '../layout';
import PartialPageDetailsProduct from '@admin/ui/partial/page/details/product';

export default async function Product({ params }: { params: Promise<typeParams> }) {
  const productId = (await params).productId;

  return (
    <div>
      <PartialPageDetailsProduct props={{ itemId: productId }} />
    </div>
  );
}
