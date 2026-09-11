import React from 'react';

import PartialPageBlog from '@web/ui/partial/page/blog';
import { LayoutIntroPage } from '@repo/ui';

export default async function Blog() {
  return (
    <div>
      <LayoutIntroPage
        props={{
          path: 'News',
          title: 'Expert Web Design Advice',
          desc: 'Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam. Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.',
        }}
      />

      <PartialPageBlog />
    </div>
  );
}
