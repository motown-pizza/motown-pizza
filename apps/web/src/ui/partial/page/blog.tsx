'use client';

import React from 'react';
import { useStorePost } from '@repo/store';
import { LayoutSection } from '@repo/ui';

export default function Blog() {
  const { posts } = useStorePost();

  return (
    <LayoutSection id={'page-blog-grid'} margined>
      <div>{JSON.stringify(posts)}</div>
    </LayoutSection>
  );
}
