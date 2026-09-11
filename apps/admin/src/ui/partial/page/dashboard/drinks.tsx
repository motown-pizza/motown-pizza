'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import TableProducts from '@admin/ui/common/tables/products';
import { ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import PartialPageIntro from '../intro';
import CardTable from '@admin/ui/common/cards/table';

export default function Drinks() {
  const { products } = useStoreProduct();

  return (
    <>
      <PartialPageIntro />

      <LayoutSection id="drink-content" containerized={false}>
        <CardTable>
          <TableProducts
            props={{
              products: products?.filter((p) => p.type == ProductType.DRINK),
            }}
          />
        </CardTable>
      </LayoutSection>
    </>
  );
}
