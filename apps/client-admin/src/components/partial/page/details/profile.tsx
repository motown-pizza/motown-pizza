'use client';

import React from 'react';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import FormProfile from '@repo/components/form/stores/profile';
import LayoutSection from '@repo/components/layout/section';
import PartialPageIntro from '../intro';

export default function Profile({
  props,
}: {
  props: { itemId?: string | null };
}) {
  const { profiles } = useStoreProfile();
  const profile = profiles?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormProfile props={{ defaultValues: profile }} />
      </LayoutSection>
    </>
  );
}
