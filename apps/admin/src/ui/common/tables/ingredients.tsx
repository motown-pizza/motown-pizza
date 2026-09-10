'use client';

import React from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberFormatter,
  Progress,
  Stack,
  TableTd,
  TableTh,
  TableTr,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useStoreIngredient } from '@repo/store';
import { getRegionalDate } from '@repo/utils';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IngredientGet } from '@repo/types';
import { MeasurementUnitType, Status, SyncStatus } from '@repo/types';
import {
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconPlus,
  IconStackPop,
  IconTrash,
} from '@tabler/icons-react';
import { ModalConfirm } from '@repo/ui';
import { useIngredientActions } from '@repo/store';
import { useTableListing } from '@repo/hooks';
import { BadgeStatus } from '@repo/ui';
import { PartialTableHeader } from '@repo/ui';
import { PartialTableMain } from '@repo/ui';
import { PartialTableFooter } from '@repo/ui';
import { CheckboxTable } from '@repo/ui';
import { ButtonPublish } from '@repo/ui';
import { ButtonActivate } from '@repo/ui';
import { ButtonDelete } from '@repo/ui';
import Link from 'next/link';

export default function Ingredients({ props }: { props?: { ingredients?: IngredientGet[] } }) {
  const { ingredients, setIngredients } = useStoreIngredient();
  const { ingredientUpdate, ingredientDelete } = useIngredientActions();

  const filteredItems = props?.ingredients || ingredients;

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
    anyActive,
    anyDraft,
  } = useTableListing({ list: filteredItems || [] });

  const rows = items.map((p) => {
    const dates = {
      created: getRegionalDate(p.createdAt),
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
                  value={p.stockQuantity == 0 ? 0 : (p.stockQuantity / 1000).toFixed(2)}
                />
              </Text>{' '}
              {p.unit == MeasurementUnitType.GRAMS ? 'Kilograms' : 'Litres'}
            </Text>

            <Progress
              value={p.stockQuantity == 0 ? 1 : (p.stockQuantity / p.stockCapacity) * 100}
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
                  <Tooltip label={`${draft ? 'Publish' : 'Unpublish'} Ingredient`}>
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      variant="light"
                      color={draft ? 'green' : 'yellow'}
                    >
                      <ingredientProps.icon.draft size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </ModalConfirm>
            )}

            <Group>
              <Tooltip label={`Stock up on ${p.name}`}>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE - 4}
                  variant="light"
                  component={Link}
                  href={`/dashboard/ingredients/stock-movements/${p.id}`}
                >
                  <IconStackPop size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>

            <Group>
              <Tooltip label={'Edit Ingredient'}>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE - 4}
                  variant="light"
                  component={Link}
                  href={`/dashboard/ingredients/stock/${p.id}`}
                >
                  <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>

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
                    <ingredientProps.icon.active size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
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
      <PartialTableHeader
        props={{
          list: filteredItems,
          selectedRows,
          search,
          setSearch,
          options: { nested: true },
        }}
      >
        <Button
          size="xs"
          leftSection={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
          component={Link}
          href={`/dashboard/ingredients/stock/new`}
        >
          Add New
        </Button>

        {selectedRows.length && (
          <>
            {selectedRows.length == 1 && (
              <Button
                size="xs"
                color="blue"
                leftSection={<IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                component={Link}
                href={`/dashboard/ingredients/stock/${selectedRows[0]}`}
              >
                Edit Item
              </Button>
            )}

            <ButtonPublish
              props={{
                anyDraft,
                onConfirm: () => {
                  setIngredients(
                    ingredients?.map((p) => {
                      if (!selectedRows.includes(p.id)) return p;

                      return {
                        ...p,
                        syncStatus: SyncStatus.PENDING,
                        status: anyDraft ? Status.ACTIVE : Status.DRAFT,
                      };
                    }),
                  );

                  setSelectedRows([]);
                },
              }}
            />

            <ButtonActivate
              props={{
                anyActive,
                onConfirm: () => {
                  setIngredients(
                    ingredients?.map((p) => {
                      if (!selectedRows.includes(p.id)) return p;

                      return {
                        ...p,
                        syncStatus: SyncStatus.PENDING,
                        status: anyActive ? Status.INACTIVE : Status.ACTIVE,
                      };
                    }),
                  );

                  setSelectedRows([]);
                },
              }}
            />

            <ButtonDelete
              props={{
                onConfirm: () => {
                  if (selectedRows.length == 1) {
                    const ingredient = ingredients?.find((i) => i.id == selectedRows[0]);

                    if (ingredient) ingredientDelete(ingredient);
                  } else {
                    const filteredIngredient = ingredients?.filter(
                      (i) => !selectedRows.includes(i.id),
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
        <TableTh w={widths.stock}>Stock</TableTh>
        <TableTh w={widths.stockStatus}>Stock Status</TableTh>
        <TableTh w={widths.status}>Status</TableTh>
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
  stock: '15%',
  stockStatus: '15%',
  status: '10%',
  added: '20%',
  actions: '15%',
};

function BadgeStockStatus({ props }: { props: IngredientGet }) {
  const badgeProps = {
    label: '',
    color: '',
  };

  const stockColor = getStockColor(props);

  if (props.stockQuantity > props.lowStockMargin) {
    badgeProps.label = 'In Stock';
    badgeProps.color = stockColor;
  } else if (props.stockQuantity > props.stockoutMargin) {
    badgeProps.label = 'Low Stock';
    badgeProps.color = stockColor;
  } else if (props.stockQuantity > 0) {
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
  if (props.stockQuantity > props.lowStockMargin) {
    return 'green';
  } else if (props.stockQuantity > props.stockoutMargin) {
    return 'yellow';
  } else if (props.stockQuantity > 0) {
    return 'red';
  } else {
    return 'pink';
  }
};
