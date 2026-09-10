import React from 'react';
import { typeParams } from '../layout';
import PartialPageDetailsStockMovement from '@admin/ui/partial/page/details/stock-movement';

export default async function StockMovement({ params }: { params: Promise<typeParams> }) {
  const stockMovementId = (await params).stockMovementId;

  return (
    <div>
      <PartialPageDetailsStockMovement props={{ itemId: stockMovementId }} />
    </div>
  );
}
