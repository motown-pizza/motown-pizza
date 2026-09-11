import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
import { APP_NAME } from '@repo/constants';

export type typeParams = Promise<{
  'postTitle-postId': string;
}>;

export const metadata: Metadata = {
  title: { default: 'Blog', template: `%s - Blog - ${APP_NAME.WEB}` },
};

export default function LayoutBlog({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
