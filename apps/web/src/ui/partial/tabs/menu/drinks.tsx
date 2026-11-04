import React from 'react';
import { Center, Divider, Grid, GridCol, Loader, Text } from '@mantine/core';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { SECTION_SPACING } from '@repo/constants';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import { capitalizeWords } from '@repo/utils';

export default function Drinks({ options }: { options?: { withAside?: boolean } }) {
  const { products } = useStoreProduct();
  const drinks = products?.filter((p) => p.status == 'ACTIVE' && p.type == ProductType.DRINK);

  return products === undefined ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Loader />
    </Center>
  ) : !drinks?.length ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Text>No drinks found.</Text>
    </Center>
  ) : (
    <section>
      <Grid>
        {sortArray(drinks, (i) => i.updatedAt, Order.DESCENDING)?.map((p, i) => (
          <GridCol
            key={i}
            span={{
              base: 12,
              xs: 6,
              sm: 4,
              md: options?.withAside ? 6 : 4,
              lg: options?.withAside ? 4 : 3,
            }}
          >
            <CardMenuMain props={p} />
          </GridCol>
        ))}
      </Grid>
    </section>
  );
}
