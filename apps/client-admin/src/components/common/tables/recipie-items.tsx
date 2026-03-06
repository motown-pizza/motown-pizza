'use client';

import React from 'react';
import {
  ActionIcon,
  Center,
  Group,
  NumberFormatter,
  Stack,
  TableTd,
  TableTh,
  TableTr,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { Status, SyncStatus } from '@repo/types/models/enums';
import {
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconTrash,
} from '@tabler/icons-react';
import ModalCrudRecipieItem from '@repo/components/common/modals/crud/recipie-item';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useRecipieItemActions } from '@repo/hooks/actions/recipie-item';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useTableListing } from '@repo/hooks/table-listing';
import BadgeStatus from '@repo/components/common/badges/status';
import PartialTableHeader from '@repo/components/partial/table/header';
import PartialTableMain from '@repo/components/partial/table/main';
import PartialTableFooter from '@repo/components/partial/table/footer';
import CheckboxTable from '@repo/components/common/checkboxes/table';
import ButtonPublish from '@repo/components/common/buttons/publish';
import ButtonActivate from '@repo/components/common/buttons/activate';
import ButtonDelete from '@repo/components/common/buttons/delete';

export default function RecipieItems({
  props,
}: {
  props?: { recipieItems?: RecipieItemGet[] };
}) {
  const { ingredients } = useStoreIngredient();
  const { productVariants } = useStoreProductVariant();
  const { recipieItems, setRecipieItems } = useStoreRecipieItem();
  const { recipieItemUpdate, recipieItemDelete } = useRecipieItemActions();

  const filteredItems = props?.recipieItems || recipieItems;

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
      created: getRegionalDate(p.created_at),
    };
    const active = p.status == Status.ACTIVE;
    const draft = p.status == Status.DRAFT;
    const recipieItemProps = {
      icon: {
        active: active ? IconMilkOff : IconMilk,
        draft: IconArrowUp,
      },
    };
    const ingredient = ingredients?.find((i) => i.id == p.ingredient_id);
    const productVariant = productVariants?.find(
      (i) => i.id == p.product_variant_id
    );

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
            <Tooltip label={ingredient?.name} multiline maw={240}>
              <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                {ingredient?.name}
              </Title>
            </Tooltip>
          </Group>
        </TableTd>

        <TableTd w={widths.product}>
          <Group gap={'xs'} wrap="nowrap">
            <Tooltip label={productVariant?.title} multiline maw={240}>
              <Title order={3} fz={'md'} fw={'normal'} lineClamp={1}>
                {productVariant?.title}
              </Title>
            </Tooltip>
          </Group>
        </TableTd>

        <TableTd w={widths.quantity}>
          <Stack gap={0}>
            <Text>
              <Text component="span" inherit>
                <NumberFormatter value={p.quantity_needed} />
              </Text>{' '}
              {capitalizeWords(p.unit || '')}
            </Text>
          </Stack>
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
                  title: `${draft ? 'Publish' : 'Unpublish'} Recipie Item`,
                  desc: draft
                    ? `(${ingredient?.name}) will be made visible to users and staff and be used for stock adjustments.`
                    : `The item (${ingredient?.name}) will no longer be visible to users and staff or used for stock adjustments.`,
                  onConfirm: () =>
                    recipieItemUpdate({
                      ...p,
                      status: draft ? Status.ACTIVE : Status.DRAFT,
                    }),
                  confirmMessage: draft
                    ? `(${ingredient?.name}) is now visible to users and staff and useable for for stock adjustments.`
                    : `(${ingredient?.name}) is no longer be visible to users and staff or useable for stock adjustments.`,
                }}
              >
                <Group>
                  <Tooltip
                    label={`${draft ? 'Publish' : 'Unpublish'} Recipie Item`}
                  >
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      variant="light"
                      color={draft ? 'green' : 'yellow'}
                    >
                      <recipieItemProps.icon.draft
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </ModalConfirm>
            )}

            <ModalCrudRecipieItem props={{ defaultValues: p }}>
              <Group>
                <Tooltip label={'Edit Recipie Item'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudRecipieItem>

            <ModalConfirm
              props={{
                title: `${active ? 'Deactivate' : 'Activate'} Recipie Item`,
                desc: active
                  ? `The item (${ingredient?.name}) will no longer be visible to users and will be used for stock adjustments.`
                  : `Visibility of the item (${ingredient?.name}) to users will be restored and will be used for stock adjustments.`,
                onConfirm: () =>
                  recipieItemUpdate({
                    ...p,
                    status: active ? Status.INACTIVE : Status.ACTIVE,
                  }),
                confirmMessage: active
                  ? `(${ingredient?.name}) is no longer visible to users useable for stock adjustments.`
                  : `Visibility of ${ingredient?.name} to users is restored and useable for stock adjustments.`,
              }}
            >
              <Group>
                <Tooltip
                  label={
                    draft
                      ? 'Item needs to be published first'
                      : `${active ? 'Deactivate' : 'Activate'} Recipie Item`
                  }
                >
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="light"
                    color={active ? 'yellow' : 'green'}
                    disabled={draft}
                  >
                    <recipieItemProps.icon.active
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `Delete Recipie Item`,
                desc: `This will remove all data associated with the item (${ingredient?.name}). This action is irreversible.`,
                onConfirm: () => recipieItemDelete(p),
                confirmMessage: `(${ingredient?.name}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Recipie Item'}>
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
            <ButtonPublish
              props={{
                anyDraft,
                onConfirm: () => {
                  setRecipieItems(
                    recipieItems?.map((p) => {
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

            <ButtonActivate
              props={{
                anyActive,
                onConfirm: () => {
                  setRecipieItems(
                    recipieItems?.map((p) => {
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
            />

            <ButtonDelete
              props={{
                onConfirm: () => {
                  if (selectedRows.length == 1) {
                    const recipieItem = recipieItems?.find(
                      (i) => i.id == selectedRows[0]
                    );

                    if (recipieItem) recipieItemDelete(recipieItem);
                  } else {
                    const filteredRecipieItems = recipieItems?.filter(
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
        <TableTh w={widths.title}>Ingredient</TableTh>
        <TableTh w={widths.product}>Product</TableTh>
        <TableTh w={widths.quantity}>Quantity Needed</TableTh>
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
  title: '15%',
  product: '15%',
  quantity: '15%',
  status: '10%',
  added: '15%',
  actions: '10%',
};
