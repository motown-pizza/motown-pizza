import React from 'react';
import { Center, Divider, Grid, GridCol, Loader, Text } from '@mantine/core';
import CardMenuMain from '@/components/common/cards/menu/main';
import { ProductDietaryType, ProductType } from '@repo/types/models/enums';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { capitalizeWords } from '@repo/utilities/string';

export default function Pizzas({
  options,
}: {
  options?: { withAside?: boolean };
}) {
  const { products } = useStoreProduct();

  // 1. Filter and Sort
  const pizzas = sortArray(
    products?.filter((p) => p.type === ProductType.PIZZA) || [],
    (i) => i.updated_at,
    Order.DESCENDING
  );

  // 2. Group by Dietary Type
  // If your environment doesn't support Object.groupBy yet,
  // you can use a simple reduce or lodash.groupBy
  const groupedPizzas = pizzas.reduce(
    (acc, pizza) => {
      const type = pizza.dietary_class || ProductDietaryType.NEUTRAL;
      if (!acc[type]) acc[type] = [];
      acc[type].push(pizza);
      return acc;
    },
    {} as Record<ProductDietaryType, typeof pizzas>
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
      {sortArray(pizzas, (i) => i.updated_at, Order.DESCENDING)?.map((p, i) => (
        <GridCol
          key={i}
          span={{ base: 12, xs: 6, sm: 4, md: options?.withAside ? 4 : 3 }}
        >
          <CardMenuMain props={p} />
        </GridCol>
      ))}
    </Grid> */}

      {Object.entries(groupedPizzas).map(([diet, items]) => (
        <section key={diet}>
          <Divider
            label={capitalizeWords(`${diet} Pizzas`)}
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
            {items.map((p, i) => (
              <GridCol
                key={p.id || i} // Prefer p.id over index if available
                span={{
                  base: 12,
                  xs: 6,
                  sm: 4,
                  md: options?.withAside ? 6 : 4,
                }}
              >
                <CardMenuMain props={p} />
              </GridCol>
            ))}
          </Grid>
        </section>
      ))}
    </>
  );
}
