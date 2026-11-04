'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  Text,
  PopoverTarget,
  PopoverDropdown,
  Button,
  Box,
  Group,
  Loader,
  Stack,
  Title,
  Tooltip,
  Indicator,
  ThemeIcon,
  Divider,
  ScrollAreaAutosize,
  Card,
} from '@mantine/core';
import { IconChevronDown, IconCurrentLocation, IconMapPin, IconPhone } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  LOCAL_STORAGE_NAME,
  SECTION_SPACING,
  StoreGet,
  stores,
} from '@repo/constants';
import { useGeolocation } from '@repo/hooks';
import { getStoresSortedByProximity } from '@web/utils/sort';
import CardStore from '../cards/store/location';
import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from '@repo/utils';
import { useStoreOrderPlacement } from '@repo/store';

export default function PopoverGeolocation({
  options,
  children,
}: {
  options?: { checkout?: boolean };
  children?: React.ReactNode;
}) {
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();

  const [opened, setOpened] = useState(false);

  const {
    location,
    error,
    loading: loadingLocation,
    requestLocation,
    revokeLocation,
  } = useGeolocation();

  const sortedStores = useMemo(() => {
    if (!location) return stores;

    return getStoresSortedByProximity(location.latitude, location.longitude, stores);
  }, [location]);

  const [resolvedStore, setResolvedStore] = useState<StoreGet | null>(null);

  useEffect(() => {
    const resolveStore = () => {
      const localStoreId = getFromLocalStorage(LOCAL_STORAGE_NAME.STORE);

      if (localStoreId) {
        const localStore = stores.find((si) => si.id == localStoreId);
        if (localStore) setResolvedStore(localStore);
        return;
      }

      if (location) {
        setResolvedStore(sortedStores[0]);
        return;
      }

      setResolvedStore(stores[0]);
    };

    resolveStore();
  }, [location]);

  useEffect(() => {
    if (resolvedStore === null) return;

    const localLocation = getFromLocalStorage(LOCAL_STORAGE_NAME.STORE);

    if (!localLocation || localLocation.id != resolvedStore) {
      saveToLocalStorage(LOCAL_STORAGE_NAME.STORE, resolvedStore?.id);
    }

    if (orderDetails === undefined) return;
    if (orderDetails === null) return;

    if (resolvedStore.id != orderDetails.storeId) {
      setOrderDetails({ ...orderDetails, storeId: resolvedStore.id });
    }
  }, [resolvedStore]);

  useEffect(() => {
    if (!location) return;
    if (!opened) return;

    close();
  }, [loadingLocation]);

  const getButton = (
    <Button
      size="xs"
      onClick={() => {
        removeFromLocalStorage(LOCAL_STORAGE_NAME.STORE);
        requestLocation();
      }}
    >
      Get Location
    </Button>
  );

  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        closeOnClickOutside
        width={400}
        position="bottom"
        withArrow
        shadow="md"
      >
        <PopoverTarget>
          <span onClick={() => setOpened((o) => !o)}>
            {children ||
              (options?.checkout ? (
                <Card bg={'dark.9'} withBorder>
                  <Group justify="space-between">
                    <Group>
                      <IconMapPin size={ICON_SIZE - 2} stroke={2} />

                      <Stack gap={0}>
                        <Title order={3} fz={'sm'} c={'white'}>
                          {resolvedStore?.locationShort} Store
                        </Title>
                        <Text fz={'xs'} c={'dimmed'}>
                          {resolvedStore?.phone}
                        </Text>
                      </Stack>
                    </Group>

                    <Group justify="end">
                      <Button color="dark" c={'sec'}>
                        Change Store
                      </Button>
                    </Group>
                  </Group>
                </Card>
              ) : (
                <Button
                  variant={options?.checkout ? undefined : 'transparent'}
                  className={
                    options?.checkout ? undefined : 'bg-[var(--mantine-color-dark-light)]/30!'
                  }
                  leftSection={<IconMapPin size={ICON_SIZE - 2} stroke={2} />}
                  rightSection={<IconChevronDown size={ICON_SIZE - 4} stroke={2} />}
                  loading={resolvedStore == null}
                  fullWidth={options?.checkout}
                >
                  {resolvedStore?.locationShort}
                </Button>
              ))}
          </span>
        </PopoverTarget>

        <PopoverDropdown p={0}>
          <ScrollAreaAutosize mah={320}>
            <Stack mih={240} p={'md'}>
              <div>
                <Box mih={26.6}>
                  {!location ? (
                    loadingLocation ? (
                      <Group justify="center">
                        <Loader />
                      </Group>
                    ) : error ? (
                      <Stack align="center">
                        <Text ta={'center'}>
                          <Text component="span" inherit c={'red'} fw={500}>
                            Error:
                          </Text>{' '}
                          Failed to get your location.
                        </Text>

                        {/* <Text>{error}</Text> */}

                        {getButton}
                      </Stack>
                    ) : (
                      <Group justify="center">
                        <Text>Activate location service:</Text>
                        {getButton}
                      </Group>
                    )
                  ) : (
                    <Stack>
                      <Group justify="center">
                        <Title order={2} fz={'md'} fw={'normal'}>
                          {/* <Text component="span" inherit c={'sec'} fw={500}>
                          Your location:
                        </Text>{' '} */}
                          <Text component="br" hiddenFrom="xs" />
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
              </div>

              <Divider />

              <Stack gap={'xs'}>
                {!sortedStores.length ? (
                  !!error ? (
                    <>
                      {stores.map((ssi, i) => (
                        <div key={ssi.id}>
                          <CardStore props={ssi} index={i + 1} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <Stack py={SECTION_SPACING}>
                      <Text ta={'center'}>Use location to see the closest store.</Text>
                    </Stack>
                  )
                ) : (
                  <>
                    {!location && <Text ta={'center'}>Use location to see the closest store.</Text>}

                    {!!location && (
                      <Title order={3} fz={'md'} c={'sec'} ta={'center'}>
                        Nearest Store
                      </Title>
                    )}

                    <CardStore
                      props={sortedStores[0]}
                      index={1}
                      setAction={
                        resolvedStore?.id == sortedStores[0].id
                          ? undefined
                          : () => {
                              setResolvedStore(sortedStores[0]);

                              setTimeout(() => {
                                revokeLocation();
                              }, 200);

                              setOpened(false);
                            }
                      }
                    />

                    {!!location && (
                      <Title order={3} fz={'md'} c={'sec'} ta={'center'} mt={'md'}>
                        Other Stores
                      </Title>
                    )}

                    {sortedStores.slice(1).map((ssi, i) => (
                      <div key={ssi.id}>
                        <CardStore
                          props={ssi}
                          index={i + 2}
                          setAction={
                            resolvedStore?.id == ssi.id
                              ? undefined
                              : () => {
                                  setResolvedStore(ssi);

                                  setTimeout(() => {
                                    revokeLocation();
                                  }, 200);

                                  setOpened(false);
                                }
                          }
                        />
                      </div>
                    ))}
                  </>
                )}
              </Stack>
            </Stack>
          </ScrollAreaAutosize>
        </PopoverDropdown>
      </Popover>

      {!options?.checkout && (
        <Button
          component={'a'}
          href={`tel:${resolvedStore?.phone}`}
          leftSection={<IconPhone size={ICON_SIZE - 2} stroke={2} />}
          variant="transparent"
        >
          {resolvedStore?.phone}
        </Button>
      )}
    </>
  );
}
