'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableOrders from '@admin/ui/common/tables/orders';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function Orders() {
  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="pizza-content" containerized={false}>
        <CardTable>
          <TableOrders />
        </CardTable>
      </LayoutSection>
    </>
  );
}
