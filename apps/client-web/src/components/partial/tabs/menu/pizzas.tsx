import React from 'react';
import { products } from '@/data/menu';
import { Grid, GridCol } from '@mantine/core';
import CardMenuMain from '@/components/common/cards/menu/main';
import { ProductType } from '@repo/types/models/enums';

export default function Pizzas({
  options,
}: {
  options?: { withAside?: boolean };
}) {
  const pizzas = products.filter((p) => p.type == ProductType.PIZZA);

  return (
    <Grid>
      {pizzas.map((p, i) => (
        <GridCol key={i} span={{ base: 12, md: options?.withAside ? 4 : 3 }}>
          <CardMenuMain props={p} />
        </GridCol>
      ))}
    </Grid>
  );
}
