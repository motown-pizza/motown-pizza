'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableDeliveries from '@admin/ui/common/tables/deliveries';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

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
