'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableOrders from '@/components/common/tables/orders';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

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
