'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableStockMovement from '@admin/ui/common/tables/stock-movement';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function StockMovements() {
  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="stock-movements-content" containerized={false}>
        <CardTable>
          <TableStockMovement />
        </CardTable>
      </LayoutSection>
    </>
  );
}
