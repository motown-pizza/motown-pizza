import React from 'react';
import { Metadata } from 'next';
import { LayoutSection } from '@repo/ui';
import TabsOrder from '@web/ui/common/tabs/order';
import AsideOrder from '@web/ui/layout/asides/order';
import { Grid, GridCol } from '@mantine/core';
import { LayoutIntroSection } from '@repo/ui';

export const metadata: Metadata = { title: 'Select Store' };

export default function SelectStore() {
  return (
    <div>
      <LayoutSection id="page-select-store-content" padded>
        <LayoutIntroSection
          props={{ title: 'Select Local Store' }}
          options={{ alignment: 'start' }}
        />

        <Grid gap={'xl'} mt={'xl'}>
          <GridCol span={{ base: 12, md: 8.5 }}>
            <TabsOrder />
          </GridCol>

          <GridCol span={{ base: 12, md: 3.5 }}>
            <AsideOrder />
          </GridCol>
        </Grid>
      </LayoutSection>
    </div>
  );
}
