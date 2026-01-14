import React from 'react';
import { Center, Grid, GridCol, Loader, Text } from '@mantine/core';
import CardMenuMain from '@/components/common/cards/menu/main';
import { ProductType } from '@repo/types/models/enums';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Drinks({
  options,
}: {
  options?: { withAside?: boolean };
}) {
  const { products } = useStoreProduct();
  const drinks = products?.filter((p) => p.type == ProductType.DRINK);

  return products === undefined ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Loader />
    </Center>
  ) : !drinks?.length ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Text>No drinks found.</Text>
    </Center>
  ) : (
    <Grid>
      {sortArray(drinks, (i) => i.updated_at, Order.DESCENDING)?.map((p, i) => (
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
