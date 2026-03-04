'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableDeliveries from '@/components/common/tables/deliveries';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';

export default function Deliveries() {
  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="pizza-content" containerized={false}>
        <Card shadow="xs">
          <TableDeliveries />
        </Card>
      </LayoutSection>
    </PartialPageLayout>
  );
}
