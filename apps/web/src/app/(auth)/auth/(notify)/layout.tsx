import React from 'react';
import { COMPANY_NAME } from '@repo/constants';
import { Metadata } from 'next';
import { LayoutAuthNotify } from '@repo/ui';

export const metadata: Metadata = {
  title: {
    default: 'Notify',
    template: `%s - Authentication - ${COMPANY_NAME}`,
  },
};

export default async function LayoutNotify({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutAuthNotify>{children}</LayoutAuthNotify>
    </>
  );
}
