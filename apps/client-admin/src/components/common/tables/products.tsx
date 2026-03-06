'use client';

import React from 'react';
import {
  ActionIcon,
  Avatar,
  Divider,
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
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { ProductGet } from '@repo/types/models/product';
import { Status, SyncStatus } from '@repo/types/models/enums';
import {
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconTrash,
} from '@tabler/icons-react';
import ModalCrudProduct from '@repo/components/common/modals/crud/product';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useProductActions } from '@repo/hooks/actions/product';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useTableListing } from '@repo/hooks/table-listing';
import BadgeStatus from '@repo/components/common/badges/status';
import BadgeDietType from '@repo/components/common/badges/diet-type';
import PartialTableHeader from '@repo/components/partial/table/header';
import PartialTableMain from '@repo/components/partial/table/main';
import PartialTableFooter from '@repo/components/partial/table/footer';
import CheckboxTable from '@repo/components/common/checkboxes/table';
import ButtonPublish from '@repo/components/common/buttons/publish';
import ButtonActivate from '@repo/components/common/buttons/activate';
import ButtonDelete from '@repo/components/common/buttons/delete';

export default function Products({
  props,
}: {
  props?: { products?: ProductGet[] };
}) {
  const { products, setProducts } = useStoreProduct();
  const { productVariants } = useStoreProductVariant();
  const { productUpdate, productDelete } = useProductActions();
  const { recipieItems } = useStoreRecipieItem();
  const { ingredients } = useStoreIngredient();

  const filteredItems = props?.products || products;

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
    const productProps = {
      icon: {
        active: active ? IconMilkOff : IconMilk,
        draft: IconArrowUp,
      },
    };
    const productVariantsCurrent = productVariants?.filter(
      (pv) => pv.product_id == p.id
    );
    const recipieItemsCurrent = recipieItems?.filter((ri) => {
      const productVariantIds = productVariantsCurrent?.map((pv) => pv.id);
      return productVariantIds?.includes(ri.product_variant_id);
    });
    const ingredientIds = recipieItemsCurrent?.map((ri) => ri.ingredient_id);
    const ingredientsCurrent = ingredients?.filter((i) =>
      ingredientIds?.includes(i.id)
    );
    const content = `${ingredientsCurrent?.map((ci) => ci.name).join(', ') ?? ''}`;

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
            <Avatar src={p.image} radius={0} size={50} />

            <Stack gap={0} align="start">
              <Tooltip label={p.title} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {p.title}
                </Title>
              </Tooltip>

              <Tooltip label={content} multiline maw={240}>
                <Text c={'dimmed'} fz={'sm'} lineClamp={1}>
                  <Text component="span" inherit>
                    {content}
                  </Text>
                </Text>
              </Tooltip>

              <Divider w={'100%'} />

              <Text fz={'sm'} c={'dimmed'}>
                Variants:{' '}
                <Text component="span" inherit c={'sec'}>
                  <NumberFormatter
                    value={productVariantsCurrent?.length || 0}
                    suffix=""
                  />
                </Text>
              </Text>
            </Stack>
          </Group>
        </TableTd>

        <TableTd w={widths.dietaryClass}>
          <BadgeDietType props={p} />
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
                  title: `${draft ? 'Publish' : 'Unpublish'} Product`,
                  desc: draft
                    ? `(${p.title}) will be made visible to users and staff.`
                    : `The item (${p.title}) will no longer be visible to users and staff.`,
                  onConfirm: () =>
                    productUpdate({
                      ...p,
                      status: draft ? Status.ACTIVE : Status.DRAFT,
                    }),
                  confirmMessage: draft
                    ? `(${p.title}) is now visible to users and staff.`
                    : `(${p.title}) is no longer be visible to users and staff.`,
                }}
              >
                <Group>
                  <Tooltip label={`${draft ? 'Publish' : 'Unpublish'} Product`}>
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      variant="light"
                      color={draft ? 'green' : 'yellow'}
                    >
                      <productProps.icon.draft
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </ModalConfirm>
            )}

            <ModalCrudProduct props={{ defaultValues: p }}>
              <Group>
                <Tooltip label={'Edit Product'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudProduct>

            <ModalConfirm
              props={{
                title: `${active ? 'Deactivate' : 'Activate'} Product`,
                desc: active
                  ? `The item (${p.title}) will no longer be visible to users.`
                  : `Visibility of the item (${p.title}) to users will be restored.`,
                onConfirm: () =>
                  productUpdate({
                    ...p,
                    status: active ? Status.INACTIVE : Status.ACTIVE,
                  }),
                confirmMessage: active
                  ? `(${p.title}) is no longer visible to users.`
                  : `Visibility of ${p.title} to users is restored.`,
              }}
            >
              <Group>
                <Tooltip
                  label={
                    draft
                      ? 'Item needs to be published first'
                      : `${active ? 'Deactivate' : 'Activate'} Product`
                  }
                >
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="light"
                    color={active ? 'yellow' : 'green'}
                    disabled={draft}
                  >
                    <productProps.icon.active
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `Delete Product`,
                desc: `This will remove all data associated with the item (${p.title}). This action is irreversible.`,
                onConfirm: () => productDelete(p),
                confirmMessage: `(${p.title}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Product'}>
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
                  setProducts(
                    products?.map((p) => {
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
                  setProducts(
                    products?.map((p) => {
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
                    const product = products?.find(
                      (i) => i.id == selectedRows[0]
                    );

                    if (product) productDelete(product);
                  } else {
                    const filteredProduct = products?.filter(
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
        <TableTh w={widths.dietaryClass}>Diet Class</TableTh>
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
  title: '45%',
  dietaryClass: '10%',
  status: '10%',
  added: '20%',
  actions: '10%',
};
