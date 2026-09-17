'use client';

import React from 'react';
import { useStoreOrder } from '@repo/store';
import { FormStoresOrder } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import PartialPageIntro from '../intro';

export default function Order({ props }: { props: { itemId?: string | null } }) {
  const { orders } = useStoreOrder();
  const order = orders?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormStoresOrder props={{ source: 'admin', defaultValues: order }} />
      </LayoutSection>
    </>
  );
}
