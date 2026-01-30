'use client';

import React from 'react';
import { AreaChart } from '@mantine/charts';
import { Card } from '@mantine/core';

export default function Main() {
  return (
    <Card bg={'var(--mantine-color-dark-8)'} pt={'xl'}>
      <AreaChart
        h={283}
        data={data}
        dataKey="date"
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
        connectNulls
        series={[
          { name: 'Orders', color: 'ter' },
          { name: 'Customers', color: 'sec' },
          { name: 'Deliveries', color: 'pri' },
        ]}
        curveType="natural"
      />
    </Card>
  );
}

export const data = [
  {
    date: 'Mar 22',
    Orders: 2890,
    Customers: 2338,
    Deliveries: 2452,
  },
  {
    date: 'Mar 23',
    Orders: 2756,
    Customers: 2103,
    Deliveries: 2402,
  },
  {
    date: 'Mar 24',
    Orders: 3322,
    Customers: 986,
    Deliveries: 1821,
  },
  {
    date: 'Mar 25',
    Orders: 3470,
    Customers: 2108,
    Deliveries: 2809,
  },
  {
    date: 'Mar 26',
    Orders: 3129,
    Customers: 1726,
    Deliveries: 2290,
  },
];
