'use client';

import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Button,
  Grid,
  GridCol,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import CardTable from '@pos/ui/common/cards/table';
import { useStoreTable } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { TableStatus } from '@repo/types';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { IconArrowLeft, IconMoodPuzzled } from '@tabler/icons-react';
import { AnchorNextLink } from '@repo/ui';
import { useStoreTableBooking } from '@repo/store';
import { getTableStatus } from '@repo/hooks';
import { TableGet } from '@repo/types';

export default function Tables() {
  const [currentStatus, setCurrentStatus] = useState('All');
  const [filteredTables, setFilteredTables] = useState<TableGet[]>([]);

  const { tables } = useStoreTable();
  const { tableBookings } = useStoreTableBooking();

  useEffect(() => {
    if (tables == undefined) return;
    if (tables == null) return;

    const getFilteredTables = () => {
      switch (currentStatus) {
        case TableStatus.BOOKED:
          setFilteredTables(
            tables.filter((ti) => {
              const tableStatus = getTableStatus({ table: ti, tableBookings });
              return tableStatus.isBooked;
            }),
          );
          break;

        case TableStatus.OCCUPIED:
          setFilteredTables(
            tables.filter((ti) => {
              const tableStatus = getTableStatus({ table: ti, tableBookings });
              return tableStatus.isOccupied;
            }),
          );
          break;

        case TableStatus.AVAILABLE:
          setFilteredTables(
            tables.filter((ti) => {
              const tableStatus = getTableStatus({ table: ti, tableBookings });
              return !tableStatus.isOccupied && !tableStatus.isBooked;
            }),
          );
          break;

        default:
          setFilteredTables(tables);
          break;
      }
    };

    const handleTableFiltering = () => {
      setFilteredTables([]);
      setTimeout(() => getFilteredTables(), 50);
    };

    handleTableFiltering();
  }, [tables, currentStatus]);

  return (
    <Stack gap={'xl'}>
      <Group
        justify="space-between"
        pos={'sticky'}
        top={0}
        py={'lg'}
        style={{
          backgroundColor: 'var(--mantine-color-dark-8)',
          zIndex: 1,
        }}
      >
        <Group>
          <AnchorNextLink href={'/pos'}>
            <Group>
              <ActionIcon size={ICON_WRAPPER_SIZE}>
                <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </AnchorNextLink>

          <Title order={2}>Tables</Title>
        </Group>

        <Group justify="end" gap={'xs'}>
          {tableStatuses.map((s, i) => (
            <Button
              key={i}
              size="xs"
              color={currentStatus === s ? 'pri' : 'gray'}
              tt={'uppercase'}
              onClick={() => setCurrentStatus(s)}
            >
              {capitalizeWords(s)}
            </Button>
          ))}
        </Group>
      </Group>

      {tables === undefined ? (
        <Stack align="center" py={SECTION_SPACING * 3}>
          <Loader />
          <Text inherit fz={'sm'} c={'dimmed'}>
            Fetching tables
          </Text>
        </Stack>
      ) : !filteredTables?.length ? (
        <Stack align="center" py={SECTION_SPACING * 2} fz={'sm'} c={'dimmed'} ta={'center'}>
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} variant="light" radius={99}>
            <IconMoodPuzzled size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>

          <Stack align="center" ta={'center'} gap={0}>
            <Text inherit>No tables with the status &apos;{currentStatus}&apos; found.</Text>

            <Text inherit maw={320} mt={'xs'}>
              Tables with this status will appear here automatically.
            </Text>
          </Stack>
        </Stack>
      ) : (
        <Grid>
          {filteredTables.map((oi, i) => (
            <GridCol key={i} span={{ base: 12, md: 3 }}>
              <CardTable props={oi} />
            </GridCol>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

const tableStatuses = ['All', TableStatus.AVAILABLE, TableStatus.BOOKED, TableStatus.OCCUPIED];
