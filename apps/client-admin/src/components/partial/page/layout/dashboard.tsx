import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { APPSHELL } from '@/data/constants';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <LayoutSection
      id={'partial-page-layout'}
      mih={`calc(100vh - ${APPSHELL.HEADER_HEIGHT + APPSHELL.FOOTER_HEIGHT}px)`}
      bg={
        'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
      }
      containerized={false}
      p={'lg'}
    >
      {children}
    </LayoutSection>
  );
}
