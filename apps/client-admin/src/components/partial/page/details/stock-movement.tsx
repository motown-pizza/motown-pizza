'use client';

import React from 'react';
import { useStoreStockMovement } from '@repo/libraries/zustand/stores/stock-movement';
import FormStockMovement from '@repo/components/form/stores/stock-movement';
import LayoutSection from '@repo/components/layout/section';
import PartialPageIntro from '../intro';

export default function StockMovement({
  props,
}: {
  props: { itemId?: string | null };
}) {
  const { stockMovements } = useStoreStockMovement();
  const stockMovement = stockMovements?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStockMovement props={{ defaultValues: stockMovement }} />
      </LayoutSection>
    </>
  );
}
