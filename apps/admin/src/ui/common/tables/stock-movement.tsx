'use client';

import React from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberFormatter,
  Stack,
  TableTd,
  TableTh,
  TableTr,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { useStoreStockMovement } from '@repo/store';
import { getRegionalDate } from '@repo/utils';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { StockMovementGet } from '@repo/types';
import { MeasurementUnitType, StockMovementType } from '@repo/types';
import { IconArrowDown, IconArrowUp, IconEdit, IconTrash } from '@tabler/icons-react';
import { ModalConfirm } from '@repo/ui';
import { useStockMovementActions } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { useStoreIngredient } from '@repo/store';
import { useStoreOrder } from '@repo/store';
import { useTableListing } from '@repo/hooks';
import { PartialTableHeader } from '@repo/ui';
import { PartialTableMain } from '@repo/ui';
import { PartialTableFooter } from '@repo/ui';
import { CheckboxTable } from '@repo/ui';
import { ButtonDelete } from '@repo/ui';
import Link from 'next/link';

export default function StockMovements({
  props,
}: {
  props?: { stockMovements?: StockMovementGet[] };
}) {
  const { stockMovements, deleteStockMovements } = useStoreStockMovement();
  const { ingredients } = useStoreIngredient();
  const { orders } = useStoreOrder();
  const { stockMovementDelete } = useStockMovementActions();

  const filteredItems = props?.stockMovements || stockMovements;

  const {
    search,
    setSearch,
    selectedRows,
    setSelectedRows,
    items,
    activePage,
    setActivePage,
    totalPages,
    pageRange,
    anyDraft,
  } = useTableListing({ list: filteredItems || [] });

  const rows = items.map((p) => {
    const dates = {
      created: getRegionalDate(p.createdAt),
    };

    const ingredient = ingredients?.find((ii) => ii.id == p.ingredientId);
    const order = orders?.find((oi) => oi.id == p.orderId);

    return (
      <TableTr
        key={p.id}
        bg={selectedRows.includes(p.id) ? 'var(--mantine-color-sec-light)' : undefined}
      >
        <TableTd w={widths.selection}>
          <CheckboxTable
            props={{
              list: filteredItems,
              selectedRows,
              setSelectedRows,
              options: { head: true, itemId: p.id },
            }}
          />
        </TableTd>

        <TableTd w={widths.title}>
          <Group gap={'xs'} wrap="nowrap">
            <Stack gap={0} align="start">
              <Tooltip label={ingredient?.name} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {ingredient?.name}
                </Title>
              </Tooltip>
            </Stack>
          </Group>
        </TableTd>

        <TableTd w={widths.quantity}>
          <Group gap={'xs'}>
            <ThemeIcon
              size={ICON_WRAPPER_SIZE - 8}
              variant="transparent"
              color={p.type == StockMovementType.PURCHASE ? 'green.6' : 'red.6'}
            >
              {p.type == StockMovementType.PURCHASE ? (
                <IconArrowUp size={ICON_WRAPPER_SIZE - 8} stroke={ICON_STROKE_WIDTH} />
              ) : (
                <IconArrowDown size={ICON_WRAPPER_SIZE - 8} stroke={ICON_STROKE_WIDTH} />
              )}
            </ThemeIcon>

            <Text fz={'sm'}>
              <Text component="span" inherit>
                <NumberFormatter
                  value={
                    p.quantity == 0
                      ? 0
                      : p.quantity > 1000
                        ? (p.quantity / 1000).toFixed(2)
                        : p.quantity
                  }
                />
              </Text>{' '}
              {ingredient?.unit == MeasurementUnitType.GRAMS
                ? p.quantity > 1000
                  ? 'Kilograms'
                  : 'Grams'
                : p.quantity > 1000
                  ? 'Litres'
                  : 'Mililitres'}
            </Text>
          </Group>
        </TableTd>

        <TableTd w={widths.type}>
          <BadgeType props={p} />
        </TableTd>

        <TableTd w={widths.type}>
          <Stack gap={0} fz={'sm'} mih={40.3} justify="center">
            {!order ? (
              <p>-</p>
            ) : (
              <>
                <Text inherit fz={'xs'}>
                  {order.trackingCode}
                </Text>

                <Text inherit c={'dimmed'}>
                  {order.customerName}
                </Text>
              </>
            )}
          </Stack>
        </TableTd>

        <TableTd
          w={widths.added}
        >{`${dates.created.date}, ${dates.created.time.toUpperCase()}`}</TableTd>

        <TableTd w={widths.actions}>
          <Group gap={'xs'} justify="end" wrap="nowrap">
            <Group>
              <Tooltip label={'Edit Stock Movement'}>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE - 4}
                  variant="light"
                  component={Link}
                  href={`/dashboard/ingredients/stock-movements/${p.id}`}
                >
                  <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>

            <ModalConfirm
              props={{
                title: `Delete Stock Movement`,
                desc: `This will reverse the stock quantity adjustment of the ingredient (${ingredient?.name}). This action is irreversible.`,
                onConfirm: () => stockMovementDelete(p),
                confirmMessage: `The stock quantity of the ingredient (${ingredient?.name}) has been reversed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Stock Movement'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light" color="red.6">
                    <IconTrash size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>
          </Group>
        </TableTd>
      </TableTr>
    );
  });

  return (
    <div>
      <PartialTableHeader props={{ list: filteredItems, selectedRows, search, setSearch }}>
        {selectedRows.length && (
          <>
            {selectedRows.length == 1 && (
              <Button
                size="xs"
                color="blue"
                leftSection={<IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                component={Link}
                href={`/dashboard/ingredients/stock-movements/${selectedRows[0]}`}
              >
                Edit Item
              </Button>
            )}

            <ButtonDelete
              props={{
                onConfirm: () => {
                  deleteStockMovements(
                    (stockMovements || []).filter((i) => selectedRows.includes(i.id)),
                  );
                },
              }}
            />
          </>
        )}
      </PartialTableHeader>

      <PartialTableMain
        props={{
          filteredItems,
          rows,
          selectedRows,
          setSelectedRows,
          widths,
        }}
      >
        <TableTh w={widths.title}>Title</TableTh>
        <TableTh w={widths.quantity}>Quantity</TableTh>
        <TableTh w={widths.type}>Type</TableTh>
        <TableTh w={widths.order}>Order</TableTh>
        <TableTh w={widths.added}>Added</TableTh>
        <TableTh w={widths.actions} />
      </PartialTableMain>

      <PartialTableFooter
        props={{
          list: filteredItems,
          activePage,
          setActivePage,
          totalPages,
          pageRange,
        }}
      />
    </div>
  );
}

const widths = {
  selection: '5%',
  title: '20%',
  quantity: '15%',
  type: '15%',
  order: '20%',
  added: '20%',
  actions: '5%',
};

function BadgeType({ props }: { props: StockMovementGet }) {
  const badgeProps = {
    label: '',
    color: '',
  };

  switch (props.type) {
    case StockMovementType.ADJUSTMENT:
      badgeProps.label = capitalizeWords(StockMovementType.ADJUSTMENT);
      badgeProps.color = 'blue';
      break;
    case StockMovementType.CONSUMPTION:
      badgeProps.label = capitalizeWords(StockMovementType.CONSUMPTION);
      badgeProps.color = 'red';
      break;
    case StockMovementType.PURCHASE:
      badgeProps.label = capitalizeWords(StockMovementType.PURCHASE);
      badgeProps.color = 'green';
      break;

    default:
      break;
  }

  return (
    <Badge variant="light" color={`${badgeProps.color}.6`}>
      {badgeProps.label}
    </Badge>
  );
}
