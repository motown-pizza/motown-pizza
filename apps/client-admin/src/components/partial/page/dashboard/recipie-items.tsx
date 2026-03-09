'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableRecipieItems from '@/components/common/tables/recipie-items';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

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
