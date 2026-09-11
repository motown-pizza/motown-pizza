import React from 'react';
import { Center, Divider, Grid, GridCol, Loader, Text } from '@mantine/core';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductDietarySubType, ProductDietaryType, ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { SECTION_SPACING } from '@repo/constants';
import { sortArray } from '@repo/utils';
import { Order } from '@repo/types';
import { capitalizeWords } from '@repo/utils';

export default function Pizzas({ options }: { options?: { withAside?: boolean } }) {
  const { products } = useStoreProduct();

  // 1. Filter and Sort
  const pizzas = sortArray(
    products?.filter((p) => p.type === ProductType.PIZZA) || [],
    (i) => i.updatedAt,
    Order.DESCENDING,
  );

  type CustomGroup = 'BEEF' | 'CHICKEN' | 'VEGGIE';

  const groupedPizzas = pizzas.reduce(
    (acc, pizza) => {
      let key: CustomGroup = 'VEGGIE';

      if (pizza.dietarySubClass === ProductDietarySubType.BEEF) {
        key = 'BEEF';
      } else if (pizza.dietarySubClass === ProductDietarySubType.CHICKEN) {
        key = 'CHICKEN';
      }

      acc[key].push(pizza);
      return acc;
    },
    { BEEF: [], CHICKEN: [], VEGGIE: [] } as Record<CustomGroup, typeof pizzas>,
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

      {Object.entries(groupedPizzas).map(([diet, items]) => (
        <section key={diet}>
          <Divider
            label={capitalizeWords(`${diet} Pizzas`)}
            my={SECTION_SPACING}
            w={{ base: '100%', md: '60%' }}
            mx={'auto'}
            color="pri"
            styles={{
              label: {
                color: 'var(--mantine-color-sec-6)',
                fontSize: 'var(--mantine-h2-font-size)',
                fontWeight: 'bold',
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
                  // xl: options?.withAside ? 4 : 3,
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
