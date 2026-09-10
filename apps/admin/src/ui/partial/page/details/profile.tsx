'use client';

import React from 'react';
import { useStoreProfile } from '@repo/store';
import { FormStoresProfile } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import PartialPageIntro from '../intro';

export default function Profile({ props }: { props: { itemId?: string | null } }) {
  const { profiles } = useStoreProfile();
  const profile = profiles?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStoresProfile props={{ defaultValues: profile }} />
      </LayoutSection>
    </>
  );
}
