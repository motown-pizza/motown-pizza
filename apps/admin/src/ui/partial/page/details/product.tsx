'use client';

import React from 'react';
import { useStoreProduct } from '@repo/store';
import { FormStoresProduct } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import PartialPageIntro from '../intro';

export default function Product({ props }: { props: { itemId?: string | null } }) {
  const { products } = useStoreProduct();
  const product = products?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStoresProduct props={{ defaultValues: product }} />
      </LayoutSection>
    </>
  );
}
