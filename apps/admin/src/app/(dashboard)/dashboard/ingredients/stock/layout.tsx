import React from 'react';
import { LayoutMain } from '@repo/ui';
import { Metadata } from 'next';
import { APP_NAME } from '@repo/constants';

export type typeParams = Promise<{
  ingredientId: string;
}>;

export const metadata: Metadata = {
  title: {
    default: 'Stock',
    template: `%s - Stock - Ingredients - Dashboard - ${APP_NAME.ADMIN}`,
  },
};

export default async function LayoutStock({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
