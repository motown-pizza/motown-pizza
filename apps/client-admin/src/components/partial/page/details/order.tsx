'use client';

import React from 'react';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import FormOrder from '@repo/components/form/stores/order';
import LayoutSection from '@repo/components/layout/section';
import PartialPageIntro from '../intro';

export default function Order({
  props,
}: {
  props: { itemId?: string | null };
}) {
  const { orders } = useStoreOrder();
  const order = orders?.find((p) => p.id === props.itemId);

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id={'detail-item'} containerized={false}>
        <FormOrder props={{ defaultValues: order }} />
      </LayoutSection>
    </>
  );
}
