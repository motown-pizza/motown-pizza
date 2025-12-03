import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import TabsMenu from '@/components/common/tabs/menu';

export const metadata: Metadata = { title: 'Menu' };

export default function Menu() {
  return (
    <LayoutPage>
      <LayoutSection id="page-menu-content" padded>
        <TabsMenu />
      </LayoutSection>
    </LayoutPage>
  );
}
