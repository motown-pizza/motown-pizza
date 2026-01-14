'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Button, Group, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalCrudProfile from '@/components/common/modals/crud/profile';
import TableProfiles from '@/components/common/tables/profiles';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utilities/url';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { Role } from '@repo/types/models/enums';

export default function Users() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);
  const title = crumbs[crumbs.length - 1].label;
  const { profiles } = useStoreProfile();

  return (
    <div>
      <LayoutSection id="users-header" margined>
        <Group justify="space-between">
          <Title order={2}>{title}</Title>

          <Group justify="end">
            <ModalCrudProfile>
              <Button
                leftSection={
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                New
              </Button>
            </ModalCrudProfile>
          </Group>
        </Group>
      </LayoutSection>

      <LayoutSection id="users-content" margined>
        <TableProfiles
          props={{
            profiles: profiles?.filter((p) => p.role == Role.USER),
          }}
        />
      </LayoutSection>
    </div>
  );
}
