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
    <section>
      <Divider
        label={capitalizeWords(`Flavored Drinks`)}
        my={SECTION_SPACING}
        w={{ base: '100%', md: '60%' }}
        mx={'auto'}
        color="sec"
        styles={{
          label: {
            color: 'var(--mantine-color-sec-6)',
            fontSize: 'var(--mantine-font-size-lg)',
            fontWeight: 500,
          },
        }}
      />

      <Grid>
        {sortArray(drinks, (i) => i.updatedAt, Order.DESCENDING)?.map(
          (p, i) =>
            p.title.toLowerCase() != 'water' && (
              <GridCol
                key={i}
                span={{
                  base: 12,
                  xs: 6,
                  sm: 4,
                  md: options?.withAside ? 6 : 4,
                }}
              >
                <CardMenuMain props={p} />
              </GridCol>
            ),
        )}
      </Grid>

      <Divider
        label={capitalizeWords(`Neutral Drinks`)}
        my={SECTION_SPACING}
        w={{ base: '100%', md: '60%' }}
        mx={'auto'}
        color="sec"
        styles={{
          label: {
            color: 'var(--mantine-color-sec-6)',
            fontSize: 'var(--mantine-font-size-lg)',
            fontWeight: 500,
          },
        }}
      />

      <Grid>
        {sortArray(drinks, (i) => i.updatedAt, Order.DESCENDING)?.map(
          (p, i) =>
            p.title.toLowerCase() == 'water' && (
              <GridCol
                key={i}
                span={{
                  base: 12,
                  xs: 6,
                  sm: 4,
                  md: options?.withAside ? 6 : 4,
                }}
              >
                <CardMenuMain props={p} />
              </GridCol>
            ),
        )}
      </Grid>
    </section>
  );
}
