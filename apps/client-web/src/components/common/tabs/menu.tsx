'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import { getUrlParam, setUrlParam } from '@repo/utilities/url';
import { PARAM_NAME } from '@repo/constants/names';
import PartialTabMenuPizzas from '@/components/partial/tabs/menu/pizzas';
import PartialTabMenuSides from '@/components/partial/tabs/menu/sides';
import PartialTabMenuDrinks from '@/components/partial/tabs/menu/drinks';
import { useSearchParams } from 'next/navigation';

export default function Menu({
  options,
}: {
  options?: { withAside?: boolean; ordering?: boolean };
}) {
  const searchparams = useSearchParams();

  const [tab, setTab] = useState('');

  useEffect(() => {
    const tabName = getUrlParam(PARAM_NAME.MENU_TAB);

    if (!tabName) {
      setUrlParam({ menuTab: 'pizzas' });
    } else {
      setTab(tabName as string);
    }
  }, [searchparams]);

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onChange={(value) => {
        setTab(value as string);
        setUrlParam({ menuTab: value });
      }}
      styles={{
        tab: {
          borderRadius: 0,
          padding: 'var(--mantine-spacing-lg) var(--mantine-spacing-xl)',
        },
        tabLabel: { fontSize: 'var(--mantine-font-size-lg)' },
        panel: { padding: 'var(--mantine-spacing-lg) 0' },
        root: { minHeight: 500 },
      }}
    >
      <TabsList>
        <TabsTab value="pizzas" w={{ base: '33%', xs: 'inherit' }}>
          Pizzas
        </TabsTab>

        <TabsTab value="sides" w={{ base: '33%', xs: 'inherit' }}>
          Sides
        </TabsTab>

        <TabsTab value="drinks" w={{ base: '33%', xs: 'inherit' }}>
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
