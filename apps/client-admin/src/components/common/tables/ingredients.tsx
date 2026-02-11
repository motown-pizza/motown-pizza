'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Badge,
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
  Title,
  Tooltip,
} from '@mantine/core';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { IngredientGet } from '@repo/types/models/ingredient';
import {
  MeasurementUnitType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconStackPop,
  IconTrash,
} from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
import ModalCrudIngredient from '../modals/crud/ingredient';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useIngredientActions } from '@repo/hooks/actions/ingredient';
import { capitalizeWords } from '@repo/utilities/string';

export default function Ingredients({
  props,
}: {
  props?: { ingredients?: IngredientGet[] };
}) {
  const { ingredients, setIngredients } = useStoreIngredient();
  const { ingredientUpdate, ingredientDelete } = useIngredientActions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = props?.ingredients || ingredients || [];

  const { items, activePage, setActivePage, totalPages, pageRange } =
    usePaginate(
      sortArray(filteredItems, (v) => v.created_at, Order.DESCENDING),
      15
    );

  const rows = items.map((p) => {
    const dates = {
      created: getRegionalDate(p.created_at),
    };
    const active = p.status == Status.ACTIVE;
    const draft = p.status == Status.DRAFT;
    const ingredientProps = {
      icon: {
        active: active ? IconMilkOff : IconMilk,
        draft: IconArrowUp,
      },
    };

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
              aria-label={`Select ${p.name}`}
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
              <Tooltip label={p.name} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {p.name}
                </Title>
              </Tooltip>
            </Stack>
          </Group>
        </TableTd>

        <TableTd w={widths.stock}>
          <Stack gap={0}>
            <Text fz={'sm'}>
              <Text component="span" inherit>
                <NumberFormatter
                  value={
                    p.stock_quantity == 0
                      ? 0
                      : (p.stock_quantity / 1000).toFixed(2)
                  }
                />
              </Text>{' '}
              {p.unit == MeasurementUnitType.GRAMS ? 'Kilograms' : 'Litres'}
            </Text>

            <Progress
              value={
                p.stock_quantity == 0
                  ? 1
                  : (p.stock_quantity / p.stock_capacity) * 100
              }
              size={3}
              color={getStockColor(p)}
            />
          </Stack>
        </TableTd>

        <TableTd w={widths.stockStatus}>
          <BadgeStockStatus props={p} />
        </TableTd>

        <TableTd w={widths.status}>
          <BadgeStatus props={p} />
        </TableTd>

        <TableTd
          w={widths.added}
        >{`${dates.created.date}, ${dates.created.time.toUpperCase()}`}</TableTd>

        <TableTd w={widths.actions}>
          <Group gap={'xs'} justify="end" wrap="nowrap">
            {draft && (
              <ModalConfirm
                props={{
                  title: `${draft ? 'Publish' : 'Unpublish'} Ingredient`,
                  desc: draft
                    ? `(${p.name}) will be made visible to users and staff.`
                    : `The item (${p.name}) will no longer be visible to users and staff.`,
                  onConfirm: () =>
                    ingredientUpdate({
                      ...p,
                      status: draft ? Status.ACTIVE : Status.DRAFT,
                    }),
                  confirmMessage: draft
                    ? `(${p.name}) is now visible to users and staff.`
                    : `(${p.name}) is no longer be visible to users and staff.`,
                }}
              >
                <Group>
                  <Tooltip
                    label={`${draft ? 'Publish' : 'Unpublish'} Ingredient`}
                  >
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      variant="light"
                      color={draft ? 'green' : 'yellow'}
                    >
                      <ingredientProps.icon.draft
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </ModalConfirm>
            )}

            <ModalCrudIngredient
              props={{ defaultValues: p, options: { stockup: true } }}
            >
              <Group>
                <Tooltip label={`Stock up on ${p.name}`}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconStackPop
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudIngredient>

            <ModalCrudIngredient props={{ defaultValues: p }}>
              <Group>
                <Tooltip label={'Edit Ingredient'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudIngredient>

            <ModalConfirm
              props={{
                title: `${active ? 'Deactivate' : 'Activate'} Ingredient`,
                desc: active
                  ? `The item (${p.name}) will no longer be visible to users.`
                  : `Visibility of the item (${p.name}) to users will be restored.`,
                onConfirm: () =>
                  ingredientUpdate({
                    ...p,
                    status: active ? Status.INACTIVE : Status.ACTIVE,
                  }),
                confirmMessage: active
                  ? `(${p.name}) is no longer visible to users.`
                  : `Visibility of ${p.name} to users is restored.`,
              }}
            >
              <Group>
                <Tooltip
                  label={
                    draft
                      ? 'Item needs to be published first'
                      : `${active ? 'Deactivate' : 'Activate'} Ingredient`
                  }
                >
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="light"
                    color={active ? 'yellow' : 'green'}
                    disabled={draft}
                  >
                    <ingredientProps.icon.active
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `Delete Ingredient`,
                desc: `This will remove all data associated with the item (${p.name}). This action is irreversible.`,
                onConfirm: () => ingredientDelete(p),
                confirmMessage: `(${p.name}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Ingredient'}>
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

  const anyActive = selectedRows?.find((iid) => {
    return filteredItems?.find((p) => p.id == iid)?.status == Status.ACTIVE;
  });

  const anyDraft = selectedRows?.find((iid) => {
    return filteredItems?.find((p) => p.id == iid)?.status == Status.DRAFT;
  });

  const ingredientsProps = {
    active: anyActive ? IconMilkOff : IconMilk,
    draft: anyDraft ? IconArrowUp : IconArrowDown,
  };

  return (
    <div>
      <Group justify="space-between" mih={30}>
        <Group>
          {ingredients === undefined ? (
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
            {selectedRows.length == 1 && (
              <ModalCrudIngredient
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
                  Edit Ingredient
                </Button>
              </ModalCrudIngredient>
            )}

            <ModalConfirm
              props={{
                title: `${anyDraft ? 'Publish' : 'Unpublish'} Ingredients`,
                desc: anyDraft
                  ? `The selected ingredients will be made visible to users.`
                  : `The selected ingredients will no longer be visible to users.`,
                onConfirm: () => {
                  setIngredients(
                    ingredients?.map((p) => {
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
                  <ingredientsProps.draft
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
              >
                {anyDraft ? 'Publish' : 'Unpublish'}
              </Button>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `${anyActive ? 'Deactivate' : 'Activate'} Ingredients`,
                desc: anyActive
                  ? `The selected ingredients will no longer be visible to users.`
                  : `Visibility of the ingredients to users will be restored.`,
                onConfirm: () => {
                  setIngredients(
                    ingredients?.map((p) => {
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
                  <ingredientsProps.active
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
              >
                {anyActive ? 'Deactivate' : 'Activate'}
              </Button>
            </ModalConfirm>
          </Group>
        )}
      </Group>

      <Table highlightOnHover={rows.length > 0} mt={'xl'}>
        <TableThead>
          <TableTr>
            <TableTh w={widths.selection}>
              <Center>
                {ingredients === undefined ? (
                  <Skeleton h={20} w={20} />
                ) : (
                  <Tooltip label={`Select/Deselect all ingredients`}>
                    <Checkbox
                      aria-label={`Select all ingredients`}
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
            <TableTh w={widths.stock}>Stock</TableTh>
            <TableTh w={widths.stockStatus}>Stock Status</TableTh>
            <TableTh w={widths.status}>Status</TableTh>
            <TableTh w={widths.added}>Added</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {ingredients === undefined ? (
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
        {ingredients === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {ingredients === undefined ? (
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
  stock: '15%',
  stockStatus: '15%',
  status: '10%',
  added: '20%',
  actions: '15%',
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

    <TableTd w={widths.stock}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.stockStatus}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.status}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.added}>
      <Skeleton h={20} w={'60%'} />
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

function BadgeStatus({ props }: { props: IngredientGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.status) {
    case Status.ACTIVE:
      badgeProps.color = 'green';
      break;
    case Status.DRAFT:
      badgeProps.color = 'blue';
      break;
    case Status.INACTIVE:
      badgeProps.color = 'yellow';
      break;

    default:
      break;
  }

  return (
    <Badge variant="dot" color={`${badgeProps.color}.9`}>
      {props.status}
    </Badge>
  );
}

function BadgeStockStatus({ props }: { props: IngredientGet }) {
  const badgeProps = {
    label: '',
    color: '',
  };

  const stockColor = getStockColor(props);

  if (props.stock_quantity > props.low_stock_margin) {
    badgeProps.label = 'In Stock';
    badgeProps.color = stockColor;
  } else if (props.stock_quantity > props.stockout_margin) {
    badgeProps.label = 'Low Stock';
    badgeProps.color = stockColor;
  } else if (props.stock_quantity > 0) {
    badgeProps.label = 'Near Stockout';
    badgeProps.color = stockColor;
  } else {
    badgeProps.label = 'Out of Stock';
    badgeProps.color = stockColor;
  }

  return (
    <Badge variant="light" color={`${badgeProps.color}.6`}>
      {badgeProps.label}
    </Badge>
  );
}

const getStockColor = (props: IngredientGet) => {
  if (props.stock_quantity > props.low_stock_margin) {
    return 'green';
  } else if (props.stock_quantity > props.stockout_margin) {
    return 'yellow';
  } else if (props.stock_quantity > 0) {
    return 'red';
  } else {
    return 'pink';
  }
};
