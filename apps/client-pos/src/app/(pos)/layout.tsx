/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import LayoutShellPos from '@/components/layout/shell/pos';
import { APP_NAME } from '@/data/constants';

export const metadata: Metadata = {
  title: {
    default: 'POS',
    template: `%s - POS - ${APP_NAME}`,
  },
};

export default async function LayoutPos({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutShellPos>{children}</LayoutShellPos>
    </LayoutBody>
  );
}
