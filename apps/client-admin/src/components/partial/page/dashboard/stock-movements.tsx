'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableStockMovement from '@/components/common/tables/stock-movement';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';

export default function StockMovements() {
  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="stock-movements-content" containerized={false}>
        <Card shadow="xs">
          <TableStockMovement />
        </Card>
      </LayoutSection>
    </PartialPageLayout>
  );
}
