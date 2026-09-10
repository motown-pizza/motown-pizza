'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Stack, Tabs, TabsList, TabsPanel, TabsTab, Text } from '@mantine/core';
import { getUrlParam, setUrlParam } from '@repo/utils';
import { PARAM_NAME } from '@repo/constants';
import { IconBuildingStore, IconMoped } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import PartialTabOrderDelivery from '@web/ui/partial/tabs/order/delivery';
import PartialTabOrderCollection from '@web/ui/partial/tabs/order/collection';

export default function Order() {
  const [tab, setTab] = useState('');

  useEffect(() => {
    const tabName = getUrlParam(PARAM_NAME.ORDER_TYPE);

    const handleSetTab = () => {
      if (!tabName) {
        setUrlParam({ orderType: 'delivery' });
      } else {
        setTab(tabName as string);
      }
    };

    handleSetTab();
  }, []);

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      keepMounted={false}
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
        panel: { padding: 'var(--mantine-spacing-lg) 0' },
      }}
    >
      <TabsList>
        <TabsTab value="delivery" w={{ base: '50%', xs: 'inherit' }}>
          <Flex direction={{ base: 'column', xs: 'row' }} align={'center'} gap={'xs'}>
            <IconMoped size={ICON_SIZE * 1.75} stroke={ICON_STROKE_WIDTH} />
            <Stack gap={0}>
              <Text component={'span'} fz={'xs'}>
                Deliver from store
              </Text>
              <Text component={'span'} fz={'sm'} fw={500} c={'ter.6'}>
                Delivery
              </Text>
            </Stack>
          </Flex>
        </TabsTab>

        <TabsTab value="collection" w={{ base: '50%', xs: 'inherit' }}>
          <Flex direction={{ base: 'column', xs: 'row' }} align={'center'} gap={'xs'}>
            <IconBuildingStore size={ICON_SIZE * 1.75} stroke={ICON_STROKE_WIDTH} />
            <Stack gap={0}>
              <Text component={'span'} fz={'xs'}>
                Collect from store
              </Text>
              <Text component={'span'} fz={'sm'} fw={500} c={'ter.6'}>
                Collection
              </Text>
            </Stack>
          </Flex>
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
