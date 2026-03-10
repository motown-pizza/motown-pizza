import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import { typeParams } from '../layout';
import PartialPageDetailsOrder from '@/components/partial/page/details/order';

export default async function Order({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const orderId = (await params).orderId;

  return (
    <LayoutPage>
      <PartialPageDetailsOrder props={{ itemId: orderId }} />
    </LayoutPage>
  );
}
