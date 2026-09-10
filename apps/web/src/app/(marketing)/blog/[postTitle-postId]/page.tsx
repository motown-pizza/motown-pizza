import React from 'react';
import { typeParams } from '../layout';
import { extractUuidFromParam, linkify } from '@repo/utils';
import { PostRelations } from '@repo/types';
// import { postsGet } from '@repo/handlers/requests/database/posts';

export async function generateStaticParams() {
  // const { items: posts }: { items: PostRelations[] } = await postsGet();

  return ([] as PostRelations[]).map((post) => ({
    'postTitle-postId': `${linkify(post.title)}-${post.id}`,
  }));
}

export default async function Post({ params }: { params: Promise<typeParams> }) {
  const postId = extractUuidFromParam((await params)['postTitle-postId']);

  if (!postId) return <>not found</>;

  return <div>{postId}</div>;
}
