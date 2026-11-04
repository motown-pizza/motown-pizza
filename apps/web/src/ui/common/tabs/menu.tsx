'use client';

import React, { useEffect, useState } from 'react';
import { Box, Divider, Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';
import { getUrlParam, setUrlParam } from '@repo/utils';
import { PARAM_NAME, SECTION_SPACING } from '@repo/constants';
import PartialTabMenuPizzas from '@web/ui/partial/tabs/menu/pizzas';
import PartialTabMenuSides from '@web/ui/partial/tabs/menu/sides';
import PartialTabMenuDrinks from '@web/ui/partial/tabs/menu/drinks';
import { useSearchParams } from 'next/navigation';
import { useWindowScroll } from '@mantine/hooks';
import { LayoutSection } from '@repo/ui';

export default function Menu({
  options,
}: {
  options?: { withAside?: boolean; ordering?: boolean };
}) {
  const searchparams = useSearchParams();

  const tab = searchparams.get(PARAM_NAME.MENU_TAB) ?? 'pizzas';

  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      variant="pills"
      onChange={(value) => {
        // setTab(value as string);
        setUrlParam({ [PARAM_NAME.MENU_TAB]: value });
        // scrollTo({ y: 275 + 32 + 48 });
      }}
      styles={{
        tabLabel: { fontWeight: 'bold' },
        panel: { padding: 'var(--mantine-spacing-sm) 0' },
        tab: {
          color: 'white',
          border: '2px solid var(--mantine-color-dark-6)',
        },
        root: { minHeight: 500 },
      }}
    >
      <div>
        <LayoutSection id="page-select-menu-tablist" pt={'xs'}>
          <TabsList style={{ flexWrap: 'wrap' }}>
            {/* Main Categories */}
            <TabsTab value="pizzas-beef" bg={tab.includes('pizzas') ? 'pri' : undefined}>
              Pizzas
            </TabsTab>
            <TabsTab value="sides-addons" bg={tab.includes('sides') ? 'pri' : undefined}>
              Sides
            </TabsTab>
            <TabsTab value="drinks" bg={tab.includes('drinks') ? 'pri' : undefined}>
              Drinks
            </TabsTab>

            <Box w={{ base: '100%' }} hiddenFrom="xs">
              <Divider my={3} />
            </Box>

            {/* Pizza Sub-Tabs */}
            <TabsTab
              value="pizzas-beef"
              style={{ border: '2px solid var(--mantine-color-sec-6)' }}
              display={tab.includes('pizzas') ? undefined : 'none'}
              ml={{ xs: 'auto' }} // Pushes to the right only on larger screens
            >
              Classic
            </TabsTab>
            <TabsTab
              value="pizzas-chicken"
              style={{ border: '2px solid var(--mantine-color-sec-6)' }}
              display={tab.includes('pizzas') ? undefined : 'none'}
            >
              Chicken
            </TabsTab>
            <TabsTab
              value="pizzas-veggie"
              style={{ border: '2px solid var(--mantine-color-sec-6)' }}
              display={tab.includes('pizzas') ? undefined : 'none'}
            >
              Veggie
            </TabsTab>

            {/* Sides Sub-Tabs */}
            <TabsTab
              value="sides-addons"
              style={{ border: '2px solid var(--mantine-color-sec-6)' }}
              display={tab.includes('sides') ? undefined : 'none'}
              ml={{ xs: 'auto' }}
            >
              Classic
            </TabsTab>
            <TabsTab
              value="sides-sauces"
              style={{ border: '2px solid var(--mantine-color-sec-6)' }}
              display={tab.includes('sides') ? undefined : 'none'}
            >
              Sauces
            </TabsTab>
          </TabsList>
        </LayoutSection>

        <Divider mt={'xs'} />
      </div>

      <TabsPanel value="pizzas">
        <LayoutSection id="pizzas">
          <PartialTabMenuPizzas options={options} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="pizzas-beef">
        <LayoutSection id="pizzas-beef">
          <PartialTabMenuPizzas options={{ ...options, filterBy: tab as any }} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="pizzas-chicken">
        <LayoutSection id="pizzas-chicken">
          <PartialTabMenuPizzas options={{ ...options, filterBy: tab as any }} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="pizzas-veggie">
        <LayoutSection id="pizzas-veggie">
          <PartialTabMenuPizzas options={{ ...options, filterBy: tab as any }} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="sides">
        <LayoutSection id="sides">
          <PartialTabMenuSides options={{ ...options, filterBy: tab as any }} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="sides-addons">
        <LayoutSection id="sides-addons">
          <PartialTabMenuSides options={{ ...options, filterBy: tab as any }} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="sides-sauces">
        <LayoutSection id="sides-sauces">
          <PartialTabMenuSides options={{ ...options, filterBy: tab as any }} />
        </LayoutSection>
      </TabsPanel>

      <TabsPanel value="drinks">
        <LayoutSection id="drinks">
          <PartialTabMenuDrinks options={options} />
        </LayoutSection>
      </TabsPanel>
    </Tabs>
  );
}
