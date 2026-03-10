/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { Metadata } from 'next';
import { APP_NAME } from '@repo/constants/app';

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
  return <LayoutBody>{children}</LayoutBody>;
}
