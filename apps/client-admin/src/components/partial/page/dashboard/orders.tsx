'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Group, Title } from '@mantine/core';
import TableOrders from '@/components/common/tables/orders';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utilities/url';

export default function Orders() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);
  const title = crumbs[crumbs.length - 1].label;

  return (
    <div>
      <LayoutSection id="pizza-header" margined>
        <Group justify="space-between">
          <Title order={2}>{title}</Title>

          {/* <Group justify="end">
            <ModalCrudProduct>
              <Button
                leftSection={
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                New
              </Button>
            </ModalCrudProduct>
          </Group> */}
        </Group>
      </LayoutSection>

      <LayoutSection id="pizza-content" margined>
        <TableOrders />
      </LayoutSection>
    </div>
  );
}
