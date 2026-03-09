'use client';

import React from 'react';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import FormRecipieItem from '@repo/components/form/stores/recipie-item';
import LayoutSection from '@repo/components/layout/section';
import PartialPageIntro from '../intro';

export default function RecipieItem({
  props,
}: {
  props: { itemId?: string | null };
}) {
  const { recipieItems } = useStoreRecipieItem();
  const recipieItem = recipieItems?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormRecipieItem props={{ defaultValues: recipieItem }} />
      </LayoutSection>
    </>
  );
}
