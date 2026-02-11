'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  NumberFormatter,
  Pagination,
  Progress,
  Skeleton,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
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
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { StockMovementGet } from '@repo/types/models/stock-movement';
import {
  MeasurementUnitType,
  StockMovementType,
} from '@repo/types/models/enums';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
// import ModalCrudStockMovement from '../modals/crud/stock-movement';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useStockMovementActions } from '@repo/hooks/actions/stock-movement';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';

export default function StockMovements({
  props,
}: {
  props?: { stockMovements?: StockMovementGet[] };
}) {
  const { stockMovements } = useStoreStockMovement();
  const { ingredients } = useStoreIngredient();
  const { orders } = useStoreOrder();
  const { stockMovementDelete } = useStockMovementActions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = props?.stockMovements || stockMovements || [];

  const { items, activePage, setActivePage, totalPages, pageRange } =
    usePaginate(
      sortArray(filteredItems, (v) => v.created_at, Order.DESCENDING),
      15
    );

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
          <Center>
            <Checkbox
              aria-label={`Select ${ingredient?.name}`}
              checked={selectedRows.includes(p.id)}
              onChange={(event) =>
                setSelectedRows(
                  event.currentTarget.checked
                    ? [...selectedRows, p.id]
                    : selectedRows.filter((item) => item !== p.id)
                )
              }
            />
          </Center>
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
      <Group justify="space-between" mih={30}>
        <Group>
          {stockMovements === undefined ? (
            <Skeleton h={20} w={120} />
          ) : (
            <Text fz={'lg'} fw={'bold'}>
              <Text component="span" inherit>
                {selectedRows.length ? 'Selected' : 'Total'}:{' '}
              </Text>

              <Text component="span" inherit>
                {selectedRows.length ? (
                  <NumberFormatter value={selectedRows.length} />
                ) : (
                  <NumberFormatter value={filteredItems.length || 0} />
                )}
              </Text>
            </Text>
          )}
        </Group>

        {selectedRows.length && (
          <Group justify="end">
            {/* {selectedRows.length == 1 && (
              <ModalCrudStockMovement
                props={{
                  defaultValues: filteredItems?.find(
                    (p) => p.id == selectedRows[0]
                  ),
                }}
              >
                <Button
                  size="xs"
                  leftSection={
                    <IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                >
                  Edit StockMovement
                </Button>
              </ModalCrudStockMovement>
            )} */}

            {/* <ModalConfirm
              props={{
                title: `${anyDraft ? 'Publish' : 'Unpublish'} StockMovements`,
                desc: anyDraft
                  ? `The selected stockMovements will be made visible to users.`
                  : `The selected stockMovements will no longer be visible to users.`,
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
            >
              <Button
                size="xs"
                leftSection={
                  <stockMovementsProps.draft
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
              >
                {anyDraft ? 'Publish' : 'Unpublish'}
              </Button>
            </ModalConfirm> */}

            {/* <ModalConfirm
              props={{
                title: `${anyActive ? 'Deactivate' : 'Activate'} StockMovements`,
                desc: anyActive
                  ? `The selected stockMovements will no longer be visible to users.`
                  : `Visibility of the stockMovements to users will be restored.`,
                onConfirm: () => {
                  setStockMovements(
                    stockMovements?.map((p) => {
                      if (!selectedRows.includes(p.id)) return p;

                      return {
                        ...p,
                        sync_status: SyncStatus.PENDING,
                        status: anyActive ? Status.INACTIVE : Status.ACTIVE,
                      };
                    })
                  );

                  setSelectedRows([]);
                },
              }}
            >
              <Button
                size="xs"
                leftSection={
                  <stockMovementsProps.active
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
              >
                {anyActive ? 'Deactivate' : 'Activate'}
              </Button>
            </ModalConfirm> */}
          </Group>
        )}
      </Group>

      <Table highlightOnHover={rows.length > 0} mt={'xl'}>
        <TableThead>
          <TableTr>
            <TableTh w={widths.selection}>
              <Center>
                {stockMovements === undefined ? (
                  <Skeleton h={20} w={20} />
                ) : (
                  <Tooltip label={`Select/Deselect all stockMovements`}>
                    <Checkbox
                      aria-label={`Select all stockMovements`}
                      checked={
                        rows.length > 0 &&
                        selectedRows.length == filteredItems?.length
                      }
                      onChange={(event) =>
                        setSelectedRows(
                          event.currentTarget.checked
                            ? (filteredItems || []).map((p) => p.id)
                            : []
                        )
                      }
                    />
                  </Tooltip>
                )}
              </Center>
            </TableTh>
            <TableTh w={widths.title}>Title</TableTh>
            <TableTh w={widths.quantity}>Quantity</TableTh>
            <TableTh w={widths.type}>Type</TableTh>
            <TableTh w={widths.order}>Order</TableTh>
            <TableTh w={widths.added}>Added</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {stockMovements === undefined ? (
            <>
              <>{sleketons}</>
              <>{sleketons}</>
              <>{sleketons}</>
              <>{sleketons}</>
              <>{sleketons}</>
            </>
          ) : !rows.length ? (
            <TableTr>
              <TableTd colSpan={100}>
                <Center py={SECTION_SPACING * 2}>
                  <Text ta={'center'} c={'dimmed'}>
                    No records found
                  </Text>
                </Center>
              </TableTd>
            </TableTr>
          ) : (
            rows
          )}
        </TableTbody>
      </Table>

      {rows.length > 0 && <Divider />}

      <Group justify="space-between" mt={'xl'}>
        {stockMovements === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {stockMovements === undefined ? (
            <>
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
              <Skeleton h={24} w={24} />
            </>
          ) : !totalPages ? null : (
            <Pagination
              size={'sm'}
              total={totalPages}
              value={activePage}
              onChange={setActivePage}
            />
          )}
        </Group>
      </Group>
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

const sleketons = (
  <TableTr h={59}>
    <TableTd w={widths.selection}>
      <Center>
        <Skeleton h={20} w={20} />
      </Center>
    </TableTd>

    <TableTd w={widths.title}>
      <Skeleton h={16} w={160} />
    </TableTd>

    <TableTd w={widths.quantity}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.type}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.order}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.added}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.actions}>
      <Group gap={'xs'} justify="end" wrap="nowrap">
        <Skeleton h={ICON_WRAPPER_SIZE - 4} w={ICON_WRAPPER_SIZE - 4} />
        <Skeleton h={ICON_WRAPPER_SIZE - 4} w={ICON_WRAPPER_SIZE - 4} />
        <Skeleton h={ICON_WRAPPER_SIZE - 4} w={ICON_WRAPPER_SIZE - 4} />
      </Group>
    </TableTd>
  </TableTr>
);

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
