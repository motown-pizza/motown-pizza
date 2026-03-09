'use client';

import React from 'react';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import FormIngredient from '@repo/components/form/stores/ingredient';
import LayoutSection from '@repo/components/layout/section';
import PartialPageIntro from '../intro';

export default function Ingredient({
  props,
}: {
  props: { itemId?: string | null };
}) {
  const { ingredients } = useStoreIngredient();
  const ingredient = ingredients?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormIngredient props={{ defaultValues: ingredient }} />
      </LayoutSection>
    </>
  );
}
