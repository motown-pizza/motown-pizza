'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableIngredients from '@admin/ui/common/tables/ingredients';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function Stock() {
  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="ingredient-content" containerized={false}>
        <CardTable>
          <TableIngredients />
        </CardTable>
      </LayoutSection>
    </>
  );
}
