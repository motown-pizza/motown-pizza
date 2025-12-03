import React from 'react';
import { stores } from '@/data/stores';
import { Grid, GridCol } from '@mantine/core';
import CardStoreMain from '@/components/common/cards/store/main';

export default function Delivery() {
  return (
    <Grid>
      {stores.map((si, i) => (
        <GridCol key={i} span={{ base: 12, md: 6 }}>
          <CardStoreMain props={si} />
        </GridCol>
      ))}
    </Grid>
  );
}
