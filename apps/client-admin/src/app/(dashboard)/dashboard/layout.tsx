/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import PartialFooterDashboard from '@/components/partial/footer/dashboard';
import { Box } from '@mantine/core';

export default async function LayoutDashboard({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <Box
        bg={
          'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
        }
      >
        {children}
      </Box>

      <PartialFooterDashboard />
    </LayoutBody>
  );
}
