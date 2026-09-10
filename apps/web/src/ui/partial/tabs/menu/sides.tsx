import React from 'react';
import { Center, Grid, GridCol, Loader, Text } from '@mantine/core';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { SECTION_SPACING } from '@repo/constants';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';

export default function Sides({ options }: { options?: { withAside?: boolean } }) {
  const { products } = useStoreProduct();
  const sides = products?.filter((p) => p.type == ProductType.SIDE);

  return products === undefined ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Loader />
    </Center>
  ) : !sides?.length ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Text>No sides found.</Text>
    </Center>
  ) : (
    <Grid>
      {sortArray(sides, (i) => i.updatedAt, Order.DESCENDING)?.map((p, i) => (
        <GridCol key={i} span={{ base: 12, xs: 6, sm: 4, md: options?.withAside ? 6 : 4 }}>
          <CardMenuMain props={p} />
        </GridCol>
      ))}
    </Grid>
  );
}
