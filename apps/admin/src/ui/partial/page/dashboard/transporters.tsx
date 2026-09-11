'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { useStoreProfile } from '@repo/store';
import TableProfiles from '@admin/ui/common/tables/profiles';
import { Role } from '@repo/types';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function Transporters() {
  const { profiles } = useStoreProfile();

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="transporter-content" containerized={false}>
        <CardTable>
          <TableProfiles
            props={{
              profiles: profiles?.filter((p) => p.role == Role.TRANSPORTER),
            }}
          />
        </CardTable>
      </LayoutSection>
    </>
  );
}
