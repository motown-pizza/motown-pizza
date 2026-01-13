'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Button, Group, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalCrudRecipieItem from '@/components/common/modals/crud/recipie-item';
import TableRecipieItems from '@/components/common/tables/recipie-items';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utilities/url';

export default function RecipieItems() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);
  const title = crumbs[crumbs.length - 1].label;

  return (
    <div>
      <LayoutSection id="recipieItem-header" margined>
        <Group justify="space-between">
          <Title order={2}>{title}</Title>

          <Group justify="end">
            <ModalCrudRecipieItem>
              <Button
                leftSection={
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                New
              </Button>
            </ModalCrudRecipieItem>
          </Group>
        </Group>
      </LayoutSection>

      <LayoutSection id="recipieItem-content" margined>
        <TableRecipieItems />
      </LayoutSection>
    </div>
  );
}
