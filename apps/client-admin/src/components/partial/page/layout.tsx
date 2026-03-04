import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { APPSHELL } from '@/data/constants';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutSection
      id={'partial-page-layout'}
      mih={`calc(100vh - ${APPSHELL.HEADER_HEIGHT + APPSHELL.FOOTER_HEIGHT}px)`}
      containerized={false}
      p={'lg'}
    >
      {children}
    </LayoutSection>
  );
}
