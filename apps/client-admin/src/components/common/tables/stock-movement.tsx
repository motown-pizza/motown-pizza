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
import { useStoreStockMovement } from '@repo/libraries/zustand/stores/stock-movement';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { StockMovementGet } from '@repo/types/models/stock-movement';
import {
  MeasurementUnitType,
  Status,
  StockMovementType,
  SyncStatus,
} from '@repo/types/models/enums';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
// import ModalCrudStockMovement from '../modals/crud/stock-movement';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useStockMovementActions } from '@repo/hooks/actions/stock-movement';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useTableListing } from '@repo/hooks/table-listing';
import PartialTableHeader from '@repo/components/partial/table/header';
import PartialTableMain from '@repo/components/partial/table/main';
import PartialTableFooter from '@repo/components/partial/table/footer';
import CheckboxTable from '@repo/components/common/checkboxes/table';
import ButtonPublish from '@repo/components/common/buttons/publish';
import ButtonDelete from '@repo/components/common/buttons/delete';
import Link from 'next/link';

export default function StockMovements({
  props,
}: {
  props?: { stockMovements?: StockMovementGet[] };
}) {
  const { stockMovements, setStockMovements } = useStoreStockMovement();
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
      created: getRegionalDate(p.created_at),
    };

    const ingredient = ingredients?.find((ii) => ii.id == p.ingredient_id);
    const order = orders?.find((oi) => oi.id == p.order_id);

    return (
      <TableTr
        key={p.id}
        bg={
          selectedRows.includes(p.id)
            ? 'var(--mantine-color-sec-light)'
            : undefined
        }
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
                <IconArrowUp
                  size={ICON_WRAPPER_SIZE - 8}
                  stroke={ICON_STROKE_WIDTH}
                />
              ) : (
                <IconArrowDown
                  size={ICON_WRAPPER_SIZE - 8}
                  stroke={ICON_STROKE_WIDTH}
                />
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
                  {order.tracking_code}
                </Text>

                <Text inherit c={'dimmed'}>
                  {order.customer_name}
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
            {/* <ModalCrudStockMovement props={{ defaultValues: p }}> */}
            <Group>
              <Tooltip label={'Edit Stock Movement'}>
                <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                  <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
            {/* </ModalCrudStockMovement> */}

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
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="light"
                    color="red.6"
                  >
                    <IconTrash
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
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
      <PartialTableHeader
        props={{ list: filteredItems, selectedRows, search, setSearch }}
      >
        {selectedRows.length && (
          <>
            {selectedRows.length == 1 && (
              <Button
                size="xs"
                color="blue"
                leftSection={
                  <IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                component={Link}
                href={``}
              >
                Edit Item
              </Button>
            )}

            <ButtonPublish
              props={{
                anyDraft,
                onConfirm: () => {
                  setStockMovements(
                    stockMovements?.map((p) => {
                      if (!selectedRows.includes(p.id)) return p;

                      return {
                        ...p,
                        sync_status: SyncStatus.PENDING,
                        status: anyDraft ? Status.ACTIVE : Status.DRAFT,
                      };
                    })
                  );

                  setSelectedRows([]);
                },
              }}
            />

            <ButtonDelete
              props={{
                onConfirm: () => {
                  if (selectedRows.length == 1) {
                    const stockMovement = stockMovements?.find(
                      (i) => i.id == selectedRows[0]
                    );

                    if (stockMovement) stockMovementDelete(stockMovement);
                  } else {
                    const filteredStockMovement = stockMovements?.filter(
                      (i) => !selectedRows.includes(i.id)
                    );
                  }
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
