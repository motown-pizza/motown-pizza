'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableProfiles from '@admin/ui/common/tables/profiles';
import { useStoreProfile } from '@repo/store';
import { Role } from '@repo/types';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

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
