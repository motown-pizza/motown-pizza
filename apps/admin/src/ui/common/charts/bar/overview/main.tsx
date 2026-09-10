'use client';

import React from 'react';
import { BarChart } from '@mantine/charts';
import { Card } from '@mantine/core';

export default function Main() {
  return (
    <Card bg={'var(--mantine-color-dark-8)'} pt={'xl'}>
      <BarChart
        h={283}
        data={data}
        dataKey="month"
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
        series={[
          { name: 'Pizzas', color: 'ter' },
          { name: 'Sides', color: 'sec' },
          { name: 'Drinks', color: 'pri' },
        ]}
        tickLine="y"
        barProps={{ radius: 99 }}
      />
    </Card>
  );
}

export const data = [
  { month: 'January', Pizzas: 1200, Sides: 900, Drinks: 200 },
  { month: 'February', Pizzas: 1900, Sides: 1200, Drinks: 400 },
  { month: 'March', Pizzas: 400, Sides: 1000, Drinks: 200 },
  { month: 'April', Pizzas: 1000, Sides: 200, Drinks: 800 },
  { month: 'May', Pizzas: 800, Sides: 1400, Drinks: 1200 },
  { month: 'June', Pizzas: 750, Sides: 600, Drinks: 1000 },
];
