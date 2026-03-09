'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableDeliveries from '@/components/common/tables/deliveries';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

export default function Deliveries() {
  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="pizza-content" containerized={false}>
        <CardTable>
          <TableDeliveries />
        </CardTable>
      </LayoutSection>
    </>
  );
}
