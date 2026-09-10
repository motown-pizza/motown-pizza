'use client';

import React from 'react';
import { useStoreIngredient } from '@repo/store';
import { FormStoresIngredient } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import PartialPageIntro from '../intro';

export default function Ingredient({ props }: { props: { itemId?: string | null } }) {
  const { ingredients } = useStoreIngredient();
  const ingredient = ingredients?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStoresIngredient props={{ defaultValues: ingredient }} />
      </LayoutSection>
    </>
  );
}
