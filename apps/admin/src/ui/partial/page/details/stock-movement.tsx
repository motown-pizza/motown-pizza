'use client';

import React from 'react';
import { useStoreStockMovement } from '@repo/store';
import { FormStoresStockMovement } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import PartialPageIntro from '../intro';

export default function StockMovement({ props }: { props: { itemId?: string | null } }) {
  const { stockMovements } = useStoreStockMovement();
  const stockMovement = stockMovements?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStoresStockMovement props={{ defaultValues: stockMovement }} />
      </LayoutSection>
    </>
  );
}
