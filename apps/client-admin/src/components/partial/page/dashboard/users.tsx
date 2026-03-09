'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableProfiles from '@/components/common/tables/profiles';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { Role } from '@repo/types/models/enums';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

export default function Users() {
  const { profiles } = useStoreProfile();

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="users-content" containerized={false}>
        <CardTable>
          <TableProfiles
            props={{
              profiles: profiles?.filter((p) => p.role == Role.USER),
            }}
          />
        </CardTable>
      </LayoutSection>
    </>
  );
}
