import React from 'react';
import { Box, Center, Divider, Grid, GridCol, Loader, Stack, Text, Title } from '@mantine/core';
import CardMenuMain from '@web/ui/common/cards/menu/main';
import { ProductDietarySubType, ProductType } from '@repo/types';
import { useStoreProduct } from '@repo/store';
import { SECTION_SPACING } from '@repo/constants';
import { capitalizeWords, sortArray } from '@repo/utils';
import { Order } from '@repo/types';

export default function Sides({ options }: { options?: { withAside?: boolean } }) {
  const { products } = useStoreProduct();

  // Filter products by type
  const allSides = products?.filter((p) => p.type === ProductType.SIDE);

  // Sauces are strictly identified by dietarySubClass === SAUCE
  const sauces = allSides?.filter((p) => p.dietarySubClass === ProductDietarySubType.SAUCE);

  // Sides are everything else under ProductType.SIDE
  const sides = allSides?.filter((p) => p.dietarySubClass !== ProductDietarySubType.SAUCE);

  const spanConfig = {
    base: 12,
    xs: 6,
    sm: 4,
    md: options?.withAside ? 6 : 4,
    xl: options?.withAside ? 4 : 3,
  };

  if (products === undefined) {
    return (
      <Center py={SECTION_SPACING} mih={400}>
        <Loader />
      </Center>
    );
  }

  if (!allSides?.length) {
    return (
      <Center py={SECTION_SPACING} mih={400}>
        <Text>No sides or sauces found.</Text>
      </Center>
    );
  }

  return (
    <>
      <Box mt={'md'}>
        <Text inherit ta={'center'}>
          <Text component="span" inherit c={'blue'} fw={500}>
            Note:
          </Text>{' '}
          Chicken wings and nuggets are drizzled with either BBQ Sauce, Peri Peri or American Ranch.
        </Text>
      </Box>

      <Stack gap="xl">
        {/* Sides Section */}
        {!!sides?.length && (
          <Stack gap="md">
            <Divider
              label={capitalizeWords(`Addons`)}
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
              {sortArray(sides, (i) => i.updatedAt, Order.DESCENDING)?.map((p) => (
                <GridCol key={p.id} span={spanConfig}>
                  <CardMenuMain props={p} />
                </GridCol>
              ))}
            </Grid>
          </Stack>
        )}

        {/* Sauces Section */}
        {!!sauces?.length && (
          <Stack gap="md">
            <Divider
              label={capitalizeWords(`Sauces`)}
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
              {sortArray(sauces, (i) => i.updatedAt, Order.DESCENDING)?.map((p) => (
                <GridCol key={p.id} span={spanConfig}>
                  <CardMenuMain props={p} />
                </GridCol>
              ))}
            </Grid>
          </Stack>
        )}
      </Stack>
    </>
  );
}
