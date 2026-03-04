'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableProfiles from '@/components/common/tables/profiles';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { Role } from '@repo/types/models/enums';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';

export default function Supervisors() {
  const { profiles } = useStoreProfile();

  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="supervisor-content" containerized={false}>
        <Card shadow="xs">
          <TableProfiles
            props={{
              profiles: profiles?.filter((p) => p.role == Role.SUPERVISOR),
            }}
          />
        </Card>
      </LayoutSection>
    </PartialPageLayout>
  );
}
