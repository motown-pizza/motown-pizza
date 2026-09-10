import React from 'react';
import { LayoutMain } from '@repo/ui';
import { Metadata } from 'next';
import { APP_NAME } from '@repo/constants';

export type typeParams = Promise<{
  stockMovementId: string;
}>;

export const metadata: Metadata = {
  title: {
    default: 'Stock Movements',
    template: `%s - Stock Movements - Ingredients - Dashboard - ${APP_NAME.ADMIN}`,
  },
};

export default async function LayoutStockMovements({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
