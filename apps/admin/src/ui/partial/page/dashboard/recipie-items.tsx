'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableRecipieItems from '@admin/ui/common/tables/recipie-items';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function RecipieItems() {
  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="recipieItem-content" containerized={false}>
        <CardTable>
          <TableRecipieItems />
        </CardTable>
      </LayoutSection>
    </>
  );
}
