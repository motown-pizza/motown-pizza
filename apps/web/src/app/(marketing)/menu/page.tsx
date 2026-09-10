import React from 'react';
import { Metadata } from 'next';
import { LayoutSection } from '@repo/ui';
import TabsMenu from '@web/ui/common/tabs/menu';

export const metadata: Metadata = { title: 'Menu' };

export default function Menu() {
  return (
    <div>
      <LayoutSection id="page-menu-content" padded>
        <TabsMenu />
      </LayoutSection>
    </div>
  );
}
