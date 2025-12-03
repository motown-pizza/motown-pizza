import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import TabsOrder from '@/components/common/tabs/order';
import AsideOrder from '@/components/layout/asides/order';
import { Grid, GridCol } from '@mantine/core';
import IntroSection from '@repo/components/layout/intros/section';

export const metadata: Metadata = { title: 'Select Store' };

export default function SelectStore() {
  return (
    <LayoutPage>
      <LayoutSection id="page-select-store-content" padded>
        <IntroSection
          props={{ title: 'Select Local Store' }}
          options={{ alignment: 'start' }}
        />

        <Grid gutter={'xl'} mt={'xl'}>
          <GridCol span={{ base: 12, md: 8.5 }}>
            <TabsOrder />
          </GridCol>

          <GridCol span={{ base: 12, md: 3.5 }}>
            <AsideOrder />
          </GridCol>
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}
