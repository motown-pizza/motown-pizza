'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import TableProducts from '@/components/common/tables/products';
import { ProductType } from '@repo/types/models/enums';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import PartialPageLayout from '../layout';
import PartialPageIntro from '../intro';
import { Card } from '@mantine/core';

export default function Drinks() {
  const { products } = useStoreProduct();

  return (
    <PartialPageLayout>
      <PartialPageIntro />

      <LayoutSection id="drink-content" containerized={false}>
        <Card shadow="xs">
          <TableProducts
            props={{
              products: products?.filter((p) => p.type == ProductType.DRINK),
            }}
          />
        </Card>
      </LayoutSection>
    </PartialPageLayout>
  );
}
