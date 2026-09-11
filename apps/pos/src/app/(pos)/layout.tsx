import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
import LayoutShellPos from '@pos/ui/layout/shell/pos';
import { APP_NAME } from '@repo/constants';

export const metadata: Metadata = {
  title: {
    default: 'POS',
    template: `%s - POS - ${APP_NAME.POS}`,
  },
};

export default async function LayoutPos({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain>
      <LayoutShellPos>{children}</LayoutShellPos>
    </LayoutMain>
  );
}
