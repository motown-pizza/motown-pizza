'use client';

import React from 'react';
import { useStoreRecipieItem } from '@repo/store';
import { FormStoresRecipieItem } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import PartialPageIntro from '../intro';

export default function RecipieItem({ props }: { props: { itemId?: string | null } }) {
  const { recipieItems } = useStoreRecipieItem();
  const recipieItem = recipieItems?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStoresRecipieItem props={{ defaultValues: recipieItem }} />
      </LayoutSection>
    </>
  );
}
