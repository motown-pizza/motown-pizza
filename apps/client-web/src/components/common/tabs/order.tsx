'use client';

import React, { useEffect, useState } from 'react';
import {
  Group,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from '@mantine/core';
import { getUrlParam, setUrlParam } from '@repo/utilities/url';
import { PARAM_NAME } from '@repo/constants/names';
import { IconBuildingStore, IconMoped } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import PartialTabOrderDelivery from '@/components/partial/tabs/order/delivery';
import PartialTabOrderCollection from '@/components/partial/tabs/order/collection';

export default function Order() {
  const [tab, setTab] = useState('');

  useEffect(() => {
    const tabName = getUrlParam(PARAM_NAME.ORDER_TYPE);

    if (!tabName) {
      setUrlParam({ orderType: 'delivery' });
    } else {
      setTab(tabName as string);
    }
  }, []);

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onChange={(value) => {
        setTab(value as string);
        setUrlParam({ orderType: value });
      }}
      styles={{
        tab: {
          borderRadius: 0,
          padding: 'var(--mantine-spacing-lg) var(--mantine-spacing-xl)',
        },
        tabLabel: { fontSize: 'var(--mantine-font-size-lg)' },
        panel: { padding: 'var(--mantine-spacing-lg)' },
      }}
    >
      <TabsList>
        <TabsTab value="delivery">
          <Group gap={'xs'}>
            <IconMoped size={ICON_SIZE * 1.75} stroke={ICON_STROKE_WIDTH} />
            <Stack gap={0}>
              <Text component={'span'} fz={'xs'}>
                Deliver from store
              </Text>
              <Text component={'span'} fz={'sm'} fw={500} c={'ter.6'}>
                Delivery
              </Text>
            </Stack>
          </Group>
        </TabsTab>

        <TabsTab value="collection">
          <Group gap={'xs'}>
            <IconBuildingStore
              size={ICON_SIZE * 1.75}
              stroke={ICON_STROKE_WIDTH}
            />
            <Stack gap={0}>
              <Text component={'span'} fz={'xs'}>
                Collect from store
              </Text>
              <Text component={'span'} fz={'sm'} fw={500} c={'ter.6'}>
                Collection
              </Text>
            </Stack>
          </Group>
        </TabsTab>
      </TabsList>

      <TabsPanel value="delivery">
        <PartialTabOrderDelivery />
      </TabsPanel>

      <TabsPanel value="collection">
        <PartialTabOrderCollection />
      </TabsPanel>
    </Tabs>
  );
}
