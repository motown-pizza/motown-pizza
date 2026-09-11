import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { PostRelations } from '@repo/types';
// import { postsGet } from '@repo/handlers/requests/database/posts';
import { extractUuidFromParam } from '@repo/utils';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const postId = extractUuidFromParam((await params)['postTitle-postId']);

  // const { items: posts }: { items: PostRelations[] } = await postsGet();
  const post = ([] as PostRelations[]).find((p) => p.id == postId);

  return {
    title: post?.title || '',
    description: post?.excerpt || '',
    category: post?.category?.title || '',
  };
};

export default function LayoutPost({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
