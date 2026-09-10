import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';

export default function LayoutProduct({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
