import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import { typeParams } from '../layout';
import PartialPageDetailsStockMovement from '@/components/partial/page/details/stock-movement';

export default async function StockMovement({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const stockMovementId = (await params).stockMovementId;

  return (
    <LayoutPage>
      <PartialPageDetailsStockMovement props={{ itemId: stockMovementId }} />
    </LayoutPage>
  );
}
