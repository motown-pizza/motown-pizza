import React from 'react';
import { Grid, GridCol } from '@mantine/core';
import CardMenuMain from '@/components/common/cards/menu/main';
import { ProductType } from '@repo/types/models/enums';
import { useStoreProduct } from '@/libraries/zustand/stores/product';

export default function Sides({
  options,
}: {
  options?: { withAside?: boolean };
}) {
  const { products } = useStoreProduct();
  const sides = products?.filter((p) => p.type == ProductType.SIDE);

  return (
    <Grid>
      {sides?.map((p, i) => (
        <GridCol
          key={i}
          span={{ base: 12, xs: 6, sm: 4, md: options?.withAside ? 4 : 3 }}
        >
          <CardMenuMain props={p} />
        </GridCol>
      ))}
    </Grid>
  );
}
