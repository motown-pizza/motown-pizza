import React from 'react';
import { Center, Divider, Grid, GridCol, Loader, Text } from '@mantine/core';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductDietarySubType, ProductDietaryType, ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { SECTION_SPACING } from '@repo/constants';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import { capitalizeWords } from '@repo/utils';

export default function Pizzas({
  options,
}: {
  options?: { withAside?: boolean; filterBy?: ProductDietaryType };
}) {
  const { products } = useStoreProduct();

  const pizzas = sortArray(
    products?.filter((p) => {
      if (p.status != 'ACTIVE') return false;
      if (p.type !== ProductType.PIZZA) return false;
      if (!p.dietaryClass) return false;
      if (!options?.filterBy) return true;

      const includesClass = options.filterBy.includes(p.dietaryClass.toLowerCase());
      const includesSubClass =
        p.dietarySubClass && options.filterBy.includes(p.dietarySubClass.toLowerCase());

      if (includesClass || includesSubClass) return true;
      return false;
    }) || [],
    (i) => i.updatedAt,
    Order.DESCENDING,
  );

  return products === undefined ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Loader />
    </Center>
  ) : !pizzas?.length ? (
    <Center py={SECTION_SPACING} mih={400}>
      <Text>No pizzas found.</Text>
    </Center>
  ) : (
    <>
      {/* <Grid>
      {sortArray(pizzas, (i) => i.updatedAt, Order.DESCENDING)?.map((p, i) => (
        <GridCol
          key={i}
          span={{ base: 12, xs: 6, sm: 4, md: options?.withAside ? 4 : 3 }}
        >
          <CardMenuMain props={p} />
        </GridCol>
      ))}
    </Grid> */}

      <Grid>
        {pizzas.map((p, i) => (
          <GridCol
            key={p.id || i} // Prefer p.id over index if available
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
    </>
  );
}
