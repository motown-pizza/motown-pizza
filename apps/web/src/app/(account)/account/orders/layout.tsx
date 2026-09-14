import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
import { APP_NAME } from '@repo/constants';

export type typeParams = Promise<{
  orderId: string;
}>;

export const metadata: Metadata = {
  title: { default: 'Orders', template: `%s - Orders - ${APP_NAME.WEB}` },
};

export default function LayoutOrders({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
