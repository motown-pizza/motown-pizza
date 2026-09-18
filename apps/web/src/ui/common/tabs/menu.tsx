'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import { getUrlParam, setUrlParam } from '@repo/utils';
import { PARAM_NAME } from '@repo/constants';
import PartialTabMenuPizzas from '@web/ui/partial/tabs/menu/pizzas';
import PartialTabMenuSides from '@web/ui/partial/tabs/menu/sides';
import PartialTabMenuDrinks from '@web/ui/partial/tabs/menu/drinks';
import { useSearchParams } from 'next/navigation';

export default function Menu({
  options,
}: {
  options?: { withAside?: boolean; ordering?: boolean };
}) {
  const searchparams = useSearchParams();

  const tab = searchparams.get(PARAM_NAME.MENU_TAB) ?? 'pizzas';

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onChange={(value) => {
        // setTab(value as string);
        setUrlParam({ [PARAM_NAME.MENU_TAB]: value });
      }}
      styles={{
        tab: {
          padding: 'var(--mantine-spacing-lg) var(--mantine-spacing-xl)',
        },
        tabLabel: { fontSize: 'var(--mantine-font-size-xl)', fontWeight: 'bold' },
        panel: { padding: 'var(--mantine-spacing-lg) 0' },
        root: { minHeight: 500 },
      }}
    >
      <TabsList justify="center">
        <TabsTab value="pizzas" w={{ base: '33%', xs: 'inherit', md: '33%' }}>
          Pizzas
        </TabsTab>

        <TabsTab value="sides" w={{ base: '33%', xs: 'inherit', md: '33%' }}>
          Sides
        </TabsTab>

        <TabsTab value="drinks" w={{ base: '33%', xs: 'inherit', md: '33%' }}>
          Drinks
        </TabsTab>
      </TabsList>

      <TabsPanel value="pizzas">
        <PartialTabMenuPizzas options={options} />
      </TabsPanel>

      <TabsPanel value="sides">
        <PartialTabMenuSides options={options} />
      </TabsPanel>

      <TabsPanel value="drinks">
        <PartialTabMenuDrinks options={options} />
      </TabsPanel>
    </Tabs>
  );
}
