'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableIngredients from '@/components/common/tables/ingredients';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';

export default function Stock() {
  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="ingredient-content" containerized={false}>
        <Card shadow="xs">
          <TableIngredients />
        </Card>
      </LayoutSection>
    </PartialPageLayout>
  );
}
