'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Button, Group, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalCrudIngredient from '@/components/common/modals/crud/ingredient';
import TableIngredients from '@/components/common/tables/ingredients';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utilities/url';

export default function Ingredients() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);
  const title = crumbs[crumbs.length - 1].label;

  return (
    <div>
      <LayoutSection id="ingredient-header" margined>
        <Group justify="space-between">
          <Title order={2}>{title}</Title>

          <Group justify="end">
            <ModalCrudIngredient>
              <Button
                leftSection={
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                New
              </Button>
            </ModalCrudIngredient>
          </Group>
        </Group>
      </LayoutSection>

      <LayoutSection id="ingredient-content" margined>
        <TableIngredients />
      </LayoutSection>
    </div>
  );
}
