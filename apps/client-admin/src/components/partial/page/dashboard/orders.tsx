'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableOrders from '@/components/common/tables/orders';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';

export default function Orders() {
  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="pizza-content" containerized={false}>
        <Card shadow="xs">
          <TableOrders />
        </Card>
      </LayoutSection>
    </PartialPageLayout>
  );
}
