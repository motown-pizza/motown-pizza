'use client';

import React from 'react';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import FormProduct from '@repo/components/form/stores/product';
import LayoutSection from '@repo/components/layout/section';
import PartialPageIntro from '../intro';

export default function Product({
  props,
}: {
  props: { itemId?: string | null };
}) {
  const { products } = useStoreProduct();
  const product = products?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormProduct props={{ defaultValues: product }} />
      </LayoutSection>
    </>
  );
}
