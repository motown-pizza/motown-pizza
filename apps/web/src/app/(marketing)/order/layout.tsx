import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
import { APP_NAME } from '@repo/constants';

export const metadata: Metadata = {
  title: { default: APP_NAME.WEB, template: `%s - Order - ${APP_NAME.WEB}` },
};

export default async function LayoutOrder({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain>
      <div>{children}</div>
    </LayoutMain>
  );
}
