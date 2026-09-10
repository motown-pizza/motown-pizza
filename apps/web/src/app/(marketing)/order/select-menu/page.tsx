import React from 'react';
import { Metadata } from 'next';
import { LayoutSection } from '@repo/ui';
import TabsMenu from '@web/ui/common/tabs/menu';
import AsideOrder from '@web/ui/layout/asides/order';
import { Grid, GridCol } from '@mantine/core';
import { LayoutIntroSection } from '@repo/ui';

export const metadata: Metadata = { title: 'Select Menu' };

export default function SelectMenu() {
  return (
    <div>
      <LayoutSection id="page-select-menu-content" padded>
        <LayoutIntroSection
          props={{ title: 'Select Menu Items' }}
          options={{ alignment: 'start' }}
        />

        <Grid gap={'xl'} mt={'xl'}>
          <GridCol span={{ base: 12, md: 8 }}>
            <TabsMenu options={{ withAside: true, ordering: true }} />
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <AsideOrder />
          </GridCol>
        </Grid>
      </LayoutSection>
    </div>
  );
}
