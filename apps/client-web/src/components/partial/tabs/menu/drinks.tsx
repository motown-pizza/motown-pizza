import React from 'react';
import { products } from '@/data/menu';
import { Grid, GridCol } from '@mantine/core';
import CardMenuMain from '@/components/common/cards/menu/main';
import { ProductType } from '@repo/types/models/enums';

export default function Drinks({
  options,
}: {
  options?: { withAside?: boolean };
}) {
  const drinks = products.filter((p) => p.type == ProductType.DRINK);

  return (
    <Grid>
      {drinks.map((p, i) => (
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
