'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableProfiles from '@admin/ui/common/tables/profiles';
import { useStoreProfile } from '@repo/store';
import { Role } from '@repo/types';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function Employees() {
  const { profiles } = useStoreProfile();

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="employees-content" containerized={false}>
        <CardTable>
          <TableProfiles
            props={{
              profiles: profiles?.filter((p) => p.role == Role.EMPLOYEE),
            }}
          />
        </CardTable>
      </LayoutSection>
    </>
  );
}
