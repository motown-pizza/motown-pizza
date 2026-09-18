'use client';

import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
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
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
  StoreGet,
} from '@repo/constants';
import { stores } from '@repo/constants';
import { IconBrandWhatsapp, IconCurrentLocation } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useGeolocation, useOrderStart } from '@repo/hooks';
import { OrderFulfilmentType } from '@repo/types';
import { extractCoordsFromIframeUrl, getDistanceInKm } from '@repo/utils';

export default function OrderType() {
  const [activeTab, setActiveTab] = useState<string | null>('delivery');

  const geolocation = useGeolocation();

  const sortedStores = useMemo(() => {
    if (!geolocation.location) return [];
    return getStoresSortedByProximity(
      geolocation.location.latitude,
      geolocation.location.longitude,
      stores,
    );
  }, [geolocation.location]);

  const styles = (v: string | null) => ({
    c: v === activeTab ? 'sec' : undefined,
  });

  return (
    <Tabs
      defaultValue={'delivery'}
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

        <TabsTab value="collection" c={styles('collection').c}>
          Collection
        </TabsTab>
      </TabsList>

      <TabsPanel value="delivery">
        <PartialOrderType
          type={OrderFulfilmentType.DELIVERY}
          geolocation={geolocation}
          sortedStores={sortedStores}
        />
      </TabsPanel>

      <TabsPanel value="collection">
        <PartialOrderType
          type={OrderFulfilmentType.COLLECTION}
          geolocation={geolocation}
          sortedStores={sortedStores}
        />
      </TabsPanel>
    </Tabs>
  );
}

function TabCard({ children }: { children: React.ReactNode }) {
  return (
    <Card bg={'var(--mantine-color-dark-9)'} p={{ base: 'md', md: 'xl' }}>
      {children}
    </Card>
  );
}

interface PartialOrderTypeProps {
  type: OrderFulfilmentType;
  desc?: string | React.ReactNode;
  geolocation: ReturnType<typeof useGeolocation>;
  sortedStores: StoreWithDistance[];
}

function PartialOrderType({ type, desc, geolocation, sortedStores }: PartialOrderTypeProps) {
  const [loaded, setLoaded] = useState(false);
  const { location, error, loading: loadingLocation, requestLocation } = geolocation;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const nearestStore = sortedStores[0];

  return (
    <Box mih={320}>
      <TabCard>
        <Stack ta={'center'}>
          <div>
            <Box mih={26.6}>
              {!location ? (
                loadingLocation ? (
                  <Group justify="center">
                    <Loader />
                  </Group>
                ) : error ? (
                  <>
                    <Text>
                      <Text component="span" inherit c={'red'} fw={500}>
                        Error:
                      </Text>{' '}
                      Failed to get your location.
                    </Text>

                    <Text>{error}</Text>
                  </>
                ) : (
                  <Group justify="center">
                    <Text>Activate location service:</Text>
                    <Button size="xs" onClick={() => requestLocation()}>
                      Get Location
                    </Button>
                  </Group>
                )
              ) : (
                <Stack>
                  <Group justify="center">
                    <Title order={2} fz={'md'} fw={'normal'}>
                      <Text component="span" inherit c={'sec'} fw={500}>
                        Your location:
                      </Text>{' '}
                      {String(location.longitude).slice(0, 10)},{' '}
                      {String(location.latitude).slice(0, 10)}
                    </Title>

                    <Tooltip label={'Location in use'}>
                      <Group>
                        <Indicator processing offset={2}>
                          <ThemeIcon size={ICON_WRAPPER_SIZE} color="sec" variant="light">
                            <IconCurrentLocation size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                          </ThemeIcon>
                        </Indicator>
                      </Group>
                    </Tooltip>
                  </Group>
                </Stack>
              )}
            </Box>

            {desc && typeof desc === 'string' ? (
              <Text>Select your location to start your order</Text>
            ) : (
              desc
            )}
          </div>

          <Divider />

          {!loaded ? (
            <Center py={SECTION_SPACING}>
              <Loader size={'sm'} />
            </Center>
          ) : (
            <Stack gap={'xs'}>
              {!sortedStores.length ? (
                <Stack py={SECTION_SPACING}>
                  <Text>Use location to see store listings.</Text>
                </Stack>
              ) : (
                <>
                  <Title order={3} fz={'xl'}>
                    Nearest Store
                  </Title>

                  <CardStore props={nearestStore} type={type} index={1} />

                  <Title order={3} fz={'xl'} mt={'md'}>
                    Other Stores
                  </Title>

                  {sortedStores.slice(1).map((ssi, i) => (
                    <div key={ssi.id}>
                      <CardStore props={ssi} type={type} index={i + 2} />
                    </div>
                  ))}
                </>
              )}
            </Stack>
          )}
        </Stack>
      </TabCard>
    </Box>
  );
}

function CardStore({
  props,
  type,
  index,
}: {
  props: StoreGet & { distanceKm: number };
  type: OrderFulfilmentType;
  index: number;
}) {
  const [loading, setLoading] = useState(false);
  const { handleStart } = useOrderStart({ storeId: props.id, stores });

  const action = () => {
    switch (type) {
      case OrderFulfilmentType.DELIVERY:
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
              Order from {props.title}
            </Button>

            <Box c={'dimmed'} fz={'xs'}>
              <Text inherit>
                Distance: <strong>{Math.round(props.distanceKm * 10) / 10} Km</strong>.
              </Text>
              <Text inherit>
                Avg. delivery time: <strong>17 - 21 min</strong>.
              </Text>
              <Text inherit>
                Delivery radius: <strong>3 - 5 min</strong>.
              </Text>
            </Box>
          </>
        );

      case OrderFulfilmentType.COLLECTION:
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
              Order from {props.title}
            </Button>

            <Box c={'dimmed'} fz={'xs'}>
              <Text inherit>
                Avg. waiting time at store: <strong>17 - 21 min</strong>.
              </Text>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  const actionComponent = action();

  return (
    <Card key={props.id} bg={'var(--mantine-color-dark-8)'} withBorder>
      <Group wrap="nowrap" w={'100%'} align="start">
        <Group mt={5}>
          <Avatar size={32}>{index}</Avatar>
        </Group>

        <Stack ta={'start'}>
          <div>
            <Title order={3} fz={'md'} c={'blue'}>
              {'MoTown'} {props.title}
            </Title>

            <Stack fz={'sm'} c={'dimmed'} gap={0} mt={5}>
              <Text inherit>
                Location:{' '}
                <Anchor inherit c={'sec'} href={props.iframe} target="_blank">
                  {props.location}
                </Anchor>
              </Text>

              <Text inherit>
                Phone Number:{' '}
                <Anchor inherit c={'sec'} href={`tel:${props.phone}`}>
                  {props.phone}
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
  );
}

export interface StoreWithDistance extends StoreGet {
  distanceKm: number;
  latitude?: number;
  longitude?: number;
}

export function getStoresSortedByProximity(
  userLat: number,
  userLng: number,
  storeList: StoreGet[],
): StoreWithDistance[] {
  return storeList
    .map((store) => {
      const coords = extractCoordsFromIframeUrl(store.iframe);

      if (!coords) {
        return { ...store, distanceKm: Infinity };
      }

      const distanceKm = getDistanceInKm(userLat, userLng, coords.latitude, coords.longitude);

      return {
        ...store,
        distanceKm,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
