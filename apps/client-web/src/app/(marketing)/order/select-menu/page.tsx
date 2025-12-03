import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import TabsMenu from '@/components/common/tabs/menu';
import AsideOrder from '@/components/layout/asides/order';
import { Grid, GridCol } from '@mantine/core';
import IntroSection from '@repo/components/layout/intros/section';

export const metadata: Metadata = { title: 'Select Menu' };

export default function SelectMenu() {
  return (
    <LayoutPage>
      <LayoutSection id="page-select-menu-content" padded>
        <IntroSection
          props={{ title: 'Select Menu Items' }}
          options={{ alignment: 'start' }}
        />

        <Grid gutter={'xl'} mt={'xl'}>
          <GridCol span={{ base: 12, md: 8.5 }}>
            <TabsMenu options={{ withAside: true, ordering: true }} />
          </GridCol>

          <GridCol span={{ base: 12, md: 3.5 }}>
            <AsideOrder />
          </GridCol>
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}
