import React from 'react';
import { LayoutMain } from '@repo/ui';
import { Metadata } from 'next';
import { APP_NAME } from '@repo/constants';

export type typeParams = Promise<{
  orderId: string;
}>;

export const metadata: Metadata = {
  title: {
    default: 'Orders',
    template: `%s - Orders - Dashboard - ${APP_NAME.ADMIN}`,
  },
};

export default async function LayoutOrders({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
