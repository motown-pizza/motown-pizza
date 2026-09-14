import React from 'react';
import { typeParams } from '../layout';
import { extractUuidFromParam } from '@repo/utils';
import PartialAccountOrder from '@web/ui/partial/page/account/order';
import { redirect } from 'next/navigation';

export default async function Order({ params }: { params: Promise<typeParams> }) {
  const orderId = extractUuidFromParam((await params).orderId);

  if (!orderId) {
    redirect('/404');
  }

  return (
    <div>
      <PartialAccountOrder orderId={orderId} />
    </div>
  );
}
