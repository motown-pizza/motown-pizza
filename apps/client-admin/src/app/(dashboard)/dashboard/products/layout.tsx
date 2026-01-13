/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { Metadata } from 'next';
import { APP_NAME } from '@/data/constants';

export const metadata: Metadata = {
  title: {
    default: 'Products',
    template: `%s - Products - Dashboard - ${APP_NAME}`,
  },
};

export default async function LayoutPeople({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <main>{children}</main>
    </LayoutBody>
  );
}
