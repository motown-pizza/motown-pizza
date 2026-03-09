'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableIngredients from '@/components/common/tables/ingredients';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

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
