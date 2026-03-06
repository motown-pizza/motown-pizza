'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableStockMovement from '@/components/common/tables/stock-movement';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

export default function StockMovements() {
  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="stock-movements-content" containerized={false}>
        <CardTable>
          <TableStockMovement />
        </CardTable>
      </LayoutSection>
    </PartialPageLayout>
  );
}
