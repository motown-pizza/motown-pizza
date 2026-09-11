import { Card } from '@mantine/core';
import React from 'react';

export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <Card shadow="xs" bg={'var(--mantine-color-body)'} padding={0}>
      {children}
    </Card>
  );
}
