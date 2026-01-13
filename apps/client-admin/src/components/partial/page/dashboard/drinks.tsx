'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Button, Group, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalCrudProduct from '@/components/common/modals/crud/product';
import TableProducts from '@/components/common/tables/products';
import { usePathname } from 'next/navigation';
import { crumbify } from '@repo/utilities/url';
import { ProductType } from '@repo/types/models/enums';
import { useStoreProduct } from '@/libraries/zustand/stores/product';

export default function Drinks() {
  const pathname = usePathname();
  const crumbs = crumbify(pathname);
  const title = crumbs[crumbs.length - 1].label;
  const { products } = useStoreProduct();

  return (
    <div>
      <LayoutSection id="drink-header" margined>
        <Group justify="space-between">
          <Title order={2}>{title}</Title>

          <Group justify="end">
            <ModalCrudProduct>
              <Button
                leftSection={
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                New
              </Button>
            </ModalCrudProduct>
          </Group>
        </Group>
      </LayoutSection>

      <LayoutSection id="drink-content" margined>
        <TableProducts
          props={{
            products: products?.filter((p) => p.type == ProductType.DRINK),
          }}
        />
      </LayoutSection>
    </div>
  );
}
