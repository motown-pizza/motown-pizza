import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { ordersGet } from '@repo/handlers';
import { OrderGet } from '@repo/types';
import { API_URL } from '@repo/constants';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const orderId = (await params).orderId;

  const { items: orders }: { items: OrderGet[] } = await ordersGet({ apiUrl: API_URL });
  const order = orders.find((p) => p.id == orderId);

  return {
    title: order?.trackingCode ? `Order ${order.trackingCode}` : 'New Order',
  };
};

export default function LayoutOrder({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
