'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import TableProfiles from '@/components/common/tables/profiles';
import { Role } from '@repo/types/models/enums';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';
import CardTable from '@/components/common/cards/table';

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
