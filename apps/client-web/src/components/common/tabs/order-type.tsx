'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Group,
  Indicator,
  Loader,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import NextLink from '@repo/components/common/anchor/next-link';
import { APP_NAME, PHONES } from '@repo/constants/app';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { stores } from '@repo/constants/stores';
import {
  IconBrandWhatsapp,
  IconCurrentLocation,
  IconLocation,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useOrderStart } from '@repo/hooks/order';
import { OrderFulfilmentType } from '@repo/types/models/enums';

export default function DeliveryType() {
  const [activeTab, setActiveTab] = useState<string | null>('delivery');

  const styles = (v: string | null) => {
    return { c: v == activeTab ? 'sec' : undefined };
  };

  return (
    <Tabs
      defaultValue="delivery"
      value={activeTab}
      onChange={setActiveTab}
      variant="outline"
      keepMounted={false}
      styles={{
        list: {
          gap: 'var(--mantine-spacing-xl)',
        },
        tab: {
          padding: 'var(--mantine-spacing-sm)',
          fontSize: 'var(--mantine-font-size-sm)',
          fontWeight: 'bold',
          // borderRadius: 99,
          minWidth: 160,
        },
        panel: {
          paddingTop: 'var(--mantine-spacing-xl)',
        },
      }}
    >
      <TabsList justify="center">
        <TabsTab value="delivery" c={styles('delivery').c}>
          Delivery
        </TabsTab>
        <TabsTab value="take-away" c={styles('take-away').c}>
          Take Away
        </TabsTab>
        <TabsTab value="call" c={styles('call').c}>
          Call To Collect
        </TabsTab>
      </TabsList>

      <TabsPanel value="delivery">
        <PartialCallCollect
          props={{
            type: 'delivery',
            title: <>Closest stores for delivery for the area</>,
          }}
        />
      </TabsPanel>

      <TabsPanel value="take-away">
        <PartialCallCollect
          props={{
            type: 'take-away',
            title: <>Closest stores for take-away for the area</>,
          }}
        />
      </TabsPanel>

      <TabsPanel value="call">
        <PartialCallCollect
          props={{
            type: 'call',
            title: <>Closest stores for call-to-order for the area</>,
          }}
        />
      </TabsPanel>
    </Tabs>
  );
}

function TabCard({ children }: { children: React.ReactNode }) {
  return (
    <Card bg={'var(--mantine-color-dark-8)'} p={{ base: 'md', md: 'xl' }}>
      {children}
    </Card>
  );
}

function PartialCallCollect({
  props,
}: {
  props: {
    type: 'delivery' | 'take-away' | 'call';
    title: string | React.ReactNode;
    desc?: string | React.ReactNode;
  };
}) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleStart } = useOrderStart({ storeId: stores[0].id, stores });

  const action = () => {
    switch (props.type) {
      case 'delivery':
        return (
          <>
            <Button
              size="xs"
              loading={loading}
              onClick={() => {
                setLoading(true);

                setTimeout(() => {
                  handleStart({
                    fulfillmentType: OrderFulfilmentType.DELIVERY,
                  });
                }, 500);
              }}
            >
              Order from {stores[0].title}
            </Button>

            <Box c={'dimmed'} fz={'xs'}>
              <Text inherit>
                Avg. delivery time: <strong>17 - 21 min</strong>.
              </Text>
              <Text inherit>
                Delivery radius: <strong>3 - 5 min</strong>.
              </Text>
            </Box>
          </>
        );
      case 'take-away':
        return (
          <>
            <Button
              size="xs"
              loading={loading}
              onClick={() => {
                setLoading(true);

                setTimeout(() => {
                  handleStart({
                    fulfillmentType: OrderFulfilmentType.COLLECTION,
                  });
                }, 500);
              }}
            >
              Order from {stores[0].title}
            </Button>

            <Box c={'dimmed'} fz={'xs'}>
              <Text inherit>
                Avg. waiting time at store: <strong>17 - 21 min</strong>.
              </Text>
            </Box>
          </>
        );
      case 'call':
        return (
          <>
            <Group gap={'xs'}>
              <Anchor inherit c={'sec'} href={`tel:${stores[0].phone}`}>
                <Button size="xs">Call {stores[0].title}</Button>
              </Anchor>

              <Anchor
                inherit
                c={'sec'}
                href={`https://wa.me/${stores[0].phone}`}
              >
                <ActionIcon size={ICON_WRAPPER_SIZE + 4} color="green">
                  <IconBrandWhatsapp
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Anchor>
            </Group>

            <Box c={'dimmed'} fz={'xs'}>
              <Text inherit c={'dimmed'} fz={'xs'}>
                Typically responds within <strong>10 min</strong>.
              </Text>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  const actionComponent = action();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box mih={320}>
      <TabCard>
        <Stack ta={'center'}>
          <div>
            <Group justify="center">
              <Title order={2} fz={'md'} fw={500}>
                {props.title}{' '}
              </Title>

              <Tooltip label={'Location in use'}>
                <Group>
                  <Indicator processing offset={2}>
                    <ThemeIcon
                      size={ICON_WRAPPER_SIZE}
                      color="sec"
                      variant="light"
                    >
                      <IconCurrentLocation
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ThemeIcon>
                  </Indicator>
                </Group>
              </Tooltip>
            </Group>

            {props.desc && typeof props.desc == 'string' ? (
              <Text>Select your location to start your order</Text>
            ) : (
              props.desc
            )}
          </div>

          {!loaded ? (
            <Center py={SECTION_SPACING}>
              <Loader size={'sm'} />
            </Center>
          ) : (
            <Card bg={'var(--mantine-color-dark-7)'}>
              <Group wrap="nowrap" w={'100%'} align="start">
                <Group mt={5}>
                  <Avatar size={32}>1</Avatar>
                </Group>

                <Stack ta={'start'}>
                  <div>
                    <Title order={3} fz={'md'} c={'blue'}>
                      {'MoTown'} {stores[0].title}
                    </Title>

                    <Stack fz={'sm'} c={'dimmed'} gap={0} mt={5}>
                      <Text inherit>
                        Location:{' '}
                        <Anchor
                          inherit
                          c={'sec'}
                          href={stores[0].iframe}
                          target="_blank"
                        >
                          {stores[0].location}
                        </Anchor>
                      </Text>

                      <Text inherit>
                        Phone Number:{' '}
                        <Anchor
                          inherit
                          c={'sec'}
                          href={`tel:${stores[0].phone}`}
                        >
                          {stores[0].phone}
                        </Anchor>
                      </Text>
                    </Stack>
                  </div>

                  <Stack gap={'xs'} align="start">
                    {actionComponent}
                  </Stack>
                </Stack>
              </Group>
            </Card>
          )}
        </Stack>
      </TabCard>
    </Box>
  );
}
