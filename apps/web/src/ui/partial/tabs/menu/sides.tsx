import React from 'react';
import { Box, Center, Divider, Grid, GridCol, Loader, Stack, Text, Title } from '@mantine/core';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductDietarySubType, ProductDietaryType, ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { SECTION_SPACING } from '@repo/constants';
import { capitalizeWords, sortArray } from '@repo/utils';
import { Order } from '@repo/types';

export default function Sides({
  options,
}: {
  options?: { withAside?: boolean; filterBy?: ProductDietaryType };
}) {
  const { products } = useStoreProduct();

  const sides = sortArray(
    products?.filter((p) => {
      if (p.status != 'ACTIVE') return false;
      if (p.type !== ProductType.SIDE) return false;
      if (!p.dietaryClass) return false;
      if (!options?.filterBy) return true;

      if (options.filterBy.includes('addons')) return !p.dietarySubClass;

      const includesClass = options.filterBy.includes(p.dietaryClass.toLowerCase());
      const includesSubClass =
        p.dietarySubClass && options.filterBy.includes(p.dietarySubClass.toLowerCase());

      if (includesClass || includesSubClass) return true;
      return false;
    }) || [],
    (i) => i.updatedAt,
    Order.DESCENDING,
  );

  const spanConfig = {
    base: 12,
    xs: 6,
    sm: 4,
    md: options?.withAside ? 6 : 4,
    lg: options?.withAside ? 4 : 3,
  };

  if (products === undefined) {
    return (
      <Center py={SECTION_SPACING} mih={400}>
        <Loader />
      </Center>
    );
  }

  if (!sides?.length) {
    return (
      <Center py={SECTION_SPACING} mih={400}>
        <Text>No sides found.</Text>
      </Center>
    );
  }

  return (
    <>
      {/* <Box mt={'md'}>
        <Text inherit ta={'center'}>
          <Text component="span" inherit c={'blue'} fw={500}>
            Note:
          </Text>{' '}
          Chicken wings and nuggets are drizzled with either BBQ Sauce, Peri Peri or American Ranch.
        </Text>
      </Box> */}

      <Stack gap="xl">
        {/* Sides Section */}
        {!!sides?.length && (
          <Grid>
            {sortArray(sides, (i) => i.updatedAt, Order.DESCENDING)?.map((p) => (
              <GridCol key={p.id} span={spanConfig}>
                <CardMenuMain props={p} />
              </GridCol>
            ))}
          </Grid>
        )}
      </Stack>
    </>
  );
}
