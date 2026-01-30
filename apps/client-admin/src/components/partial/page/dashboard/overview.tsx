'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconBusinessplan,
  IconCancel,
  IconCashRegister,
  IconCategory,
  IconCheck,
  IconClock,
  IconMeat,
  IconMilk,
  IconMoneybag,
  IconPaperBag,
  IconPlus,
  IconRefreshDot,
  IconShoppingCartDollar,
  IconTruckReturn,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalCrudProfile from '@/components/common/modals/crud/profile';
import { useTime } from '@repo/hooks/time';
import { getRegionalDate } from '@repo/utilities/date-time';
import CardOverviewMain from '@/components/common/cards/overview/main';
import ChartAreaOverviewMain from '@/components/common/charts/area/overview/main';
import ChartBarOverviewMain from '@/components/common/charts/bar/overview/main';

export default function Overview() {
  const { now } = useTime();

  const regionalDate = getRegionalDate(now, {
    locale: 'en-GB',
    format: 'full',
  });

  return (
    <div>
      <LayoutSection id="overview-header" margined mb={'xl'}>
        <Group justify="space-between">
          <div>
            <Title order={2}>Hello, Mike</Title>
            <Text c={'dimmed'}>
              Welcome back! Here&apos;s a snapshot of what&apos;s been going on.
            </Text>
          </div>

          <Group justify="end" ta={'end'}>
            <div>
              <Title order={2}>{regionalDate.time.toUpperCase()}</Title>
              <Text c={'dimmed'}>{regionalDate.date}</Text>
            </div>
          </Group>
        </Group>
      </LayoutSection>

      <LayoutSection id="overview-content" margined mt={'xl'}>
        <Grid gutter={'lg'}>
          <GridCol span={8}>
            <Card bg={'transparent'} withBorder>
              <Stack>
                <div>
                  <Title order={3} fz={'xl'}>
                    General Summary
                  </Title>
                </div>

                <ChartAreaOverviewMain />
              </Stack>
            </Card>
          </GridCol>

          <GridCol span={4}>
            <Card bg={'var(--mantine-color-dark-7)'}>
              <Stack>
                <div>
                  <Title order={3} fz={'xl'}>
                    Weekly Totals
                  </Title>
                </div>

                <Grid>
                  {overviewItemsMain.map(
                    (oi, i) =>
                      i < 2 && (
                        <GridCol key={i} span={12}>
                          <CardOverviewMain
                            props={oi}
                            bg={'var(--mantine-color-dark-8)'}
                          />
                        </GridCol>
                      )
                  )}
                </Grid>
              </Stack>
            </Card>
          </GridCol>

          <GridCol span={12} my={'xs'}>
            <Card bg={'transparent'} withBorder>
              <Stack>
                <div>
                  <Title order={3} fz={'xl'}>
                    Order Insights
                  </Title>
                </div>

                <Grid>
                  {overviewItemsOrders.map((oi, i) => (
                    <GridCol key={i} span={3}>
                      <CardOverviewMain
                        props={oi}
                        bg={'var(--mantine-color-dark-8)'}
                      />
                    </GridCol>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </GridCol>

          <GridCol span={12} my={'xs'}>
            <Card bg={'var(--mantine-color-dark-8)'}>
              <Stack>
                <div>
                  <Title order={3} fz={'xl'}>
                    Top Listings
                  </Title>
                </div>

                <Grid gutter={'lg'}>
                  <GridCol span={4}>
                    <Card bg={'var(--mantine-color-body)'}>
                      <Stack>
                        <div>
                          <Title order={4} fz={'md'} fw={500}>
                            Top Weekly Averages
                          </Title>
                        </div>

                        <Grid>
                          {overviewItemsTops.topAverages.map((oi, i) => (
                            <GridCol key={i} span={12}>
                              <CardOverviewMain
                                props={oi}
                                bg={'var(--mantine-color-dark-8)'}
                              />
                            </GridCol>
                          ))}
                        </Grid>
                      </Stack>
                    </Card>
                  </GridCol>

                  <GridCol span={8}>
                    <Card bg={'var(--mantine-color-body)'}>
                      <Stack>
                        <div>
                          <Title order={4} fz={'md'} fw={500}>
                            Product Sale Summary
                          </Title>
                        </div>

                        <ChartBarOverviewMain />
                      </Stack>
                    </Card>
                  </GridCol>
                </Grid>
              </Stack>
            </Card>
          </GridCol>

          <GridCol span={12}>
            <Grid>
              <GridCol span={8}>
                <Card bg={'transparent'} withBorder>
                  <Stack>
                    <div>
                      <Title order={3} fz={'xl'}>
                        Weekly Totals
                      </Title>
                    </div>

                    <Grid>
                      {overviewItemsTops.topSelling.map((oi, i) => (
                        <GridCol key={i} span={6}>
                          <CardOverviewMain
                            props={oi}
                            bg={'var(--mantine-color-dark-8)'}
                          />
                        </GridCol>
                      ))}
                    </Grid>
                  </Stack>
                </Card>
              </GridCol>

              <GridCol span={4}>
                <Card bg={'transparent'} withBorder>
                  <Stack>
                    <div>
                      <Title order={3} fz={'xl'}>
                        Weekly Totals
                      </Title>
                    </div>

                    <Grid>
                      {overviewItemsMain.map(
                        (oi, i) =>
                          i > 1 && (
                            <GridCol key={i} span={12}>
                              <CardOverviewMain
                                props={oi}
                                bg={'var(--mantine-color-dark-8)'}
                              />
                            </GridCol>
                          )
                      )}
                    </Grid>
                  </Stack>
                </Card>
              </GridCol>
            </Grid>
          </GridCol>
        </Grid>
      </LayoutSection>
    </div>
  );
}

// list of sample overview items (randomized + varied analytics)

const overviewItemsMain = [
  {
    title: 'Total Earnings',
    icon: { icon: IconCashRegister, color: 'cyan.8' },
    value: 18432,
    analytics: {
      change: 4.6,
      changeType: 'down',
      desc: 'compared to last week',
    },
  },
  {
    title: 'Total Orders',
    icon: { icon: IconPaperBag, color: 'grape.8' },
    value: 296,
    analytics: {
      change: 1.9,
      changeType: 'up',
      desc: 'since last update',
    },
  },
  {
    title: 'Total Customers',
    icon: { icon: IconUsers, color: 'lime.8' },
    value: 1248,
    analytics: {
      change: 3.2,
      changeType: 'down',
      desc: 'over the past 7 days',
    },
  },
  {
    title: 'Total Products',
    icon: { icon: IconMilk, color: 'orange.8' },
    value: 86,
    analytics: {
      change: 0.8,
      changeType: 'down',
      desc: 'compared to last month',
    },
  },
];

// order insights
const overviewItemsOrders = [
  {
    title: 'Pending Orders',
    icon: { icon: IconRefreshDot, color: 'blue.8' },
    value: 42,
    analytics: {
      change: 6.4,
      changeType: 'up',
      desc: 'since this morning',
    },
  },
  {
    title: 'Completed Orders',
    icon: { icon: IconCheck, color: 'green.8' },
    value: 214,
    analytics: {
      change: 2.1,
      changeType: 'down',
      desc: 'compared to yesterday',
    },
  },
  {
    title: 'Cancelled Orders',
    icon: { icon: IconCancel, color: 'red.8' },
    value: 17,
    analytics: {
      change: 5.3,
      changeType: 'up',
      desc: 'over the last 24 hours',
    },
  },
  {
    title: 'Refunded Orders',
    icon: { icon: IconTruckReturn, color: 'violet.8' },
    value: 9,
    analytics: {
      change: 1.4,
      changeType: 'down',
      desc: 'week over week',
    },
  },
];

// top listings
const overviewItemsTops = {
  topSelling: [
    {
      title: 'Top Selling Product',
      icon: { icon: IconBusinessplan, color: 'yellow.8' },
      value: 128,
      analytics: {
        change: 3.7,
        changeType: 'up',
        desc: 'based on today’s sales',
      },
    },
    {
      title: 'Top Selling Category',
      icon: { icon: IconCategory, color: 'indigo.8' },
      value: 54,
      analytics: {
        change: 2.9,
        changeType: 'down',
        desc: 'compared to last weekend',
      },
    },
    {
      title: 'Top Selling Side(s)',
      icon: { icon: IconMeat, color: 'teal.8' },
      value: 73,
      analytics: {
        change: 1.2,
        changeType: 'up',
        desc: 'since yesterday afternoon',
      },
    },
    {
      title: 'Top Customer',
      icon: { icon: IconUser, color: 'pink.8' },
      value: 18,
      analytics: {
        change: 4.8,
        changeType: 'down',
        desc: 'compared to last month',
      },
    },
  ],
  topAverages: [
    {
      title: 'Avg. Order Value',
      icon: { icon: IconShoppingCartDollar, color: 'pink.8' },
      value: 42.75,
      analytics: {
        change: 1.6,
        changeType: 'down',
        desc: 'over the past 30 days',
      },
    },
    {
      title: 'Avg. Processing Time',
      icon: { icon: IconClock, color: 'cyan.8' },
      value: 18.4,
      analytics: {
        change: 2.3,
        changeType: 'up',
        desc: 'since last deployment',
      },
    },
  ],
};
