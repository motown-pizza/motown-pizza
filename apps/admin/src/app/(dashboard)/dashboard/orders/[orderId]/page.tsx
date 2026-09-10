import React from 'react';
import { typeParams } from '../layout';
import PartialPageDetailsOrder from '@admin/ui/partial/page/details/order';

export default async function Order({ params }: { params: Promise<typeParams> }) {
  const orderId = (await params).orderId;

  return (
    <div>
      <PartialPageDetailsOrder props={{ itemId: orderId }} />
    </div>
  );
}
