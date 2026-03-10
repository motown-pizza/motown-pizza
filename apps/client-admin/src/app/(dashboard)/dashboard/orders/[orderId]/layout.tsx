import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { ordersGet } from '@repo/handlers/requests/database/orders';
import { OrderGet } from '@repo/types/models/order';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const orderId = (await params).orderId;

  const { items: orders }: { items: OrderGet[] } = await ordersGet();
  const order = orders.find((p) => p.id == orderId);

  return {
    title: order?.tracking_code ? `Order ${order.tracking_code}` : 'New Order',
  };
};

export default function LayoutOrder({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
