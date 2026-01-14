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
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { Status, SyncStatus } from '@repo/types/models/enums';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconTrash,
} from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
import ModalCrudRecipieItem from '../modals/crud/recipie-item';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useRecipieItemActions } from '@repo/hooks/actions/recipie-item';
import { capitalizeWords } from '@repo/utilities/string';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';

export default function RecipieItems({
  props,
}: {
  props?: { recipieItems?: RecipieItemGet[] };
}) {
  const { ingredients } = useStoreIngredient();
  const { productVariants } = useStoreProductVariant();
  const { recipieItems, setRecipieItems } = useStoreRecipieItem();
  const { recipieItemUpdate, recipieItemDelete } = useRecipieItemActions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = props?.recipieItems || recipieItems || [];

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

  const anyActive = selectedRows?.find((iid) => {
    return filteredItems?.find((p) => p.id == iid)?.status == Status.ACTIVE;
  });

  const anyDraft = selectedRows?.find((iid) => {
    return filteredItems?.find((p) => p.id == iid)?.status == Status.DRAFT;
  });

  const recipieItemsProps = {
    active: anyActive ? IconMilkOff : IconMilk,
    draft: anyDraft ? IconArrowUp : IconArrowDown,
  };

  return (
    <div>
      <Group justify="space-between" mih={30}>
        <Group>
          {recipieItems === undefined ? (
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
              <ModalCrudRecipieItem
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
                  Edit Recipie Item
                </Button>
              </ModalCrudRecipieItem>
            )}

            <ModalConfirm
              props={{
                title: `${anyDraft ? 'Publish' : 'Unpublish'} Recipie Items`,
                desc: anyDraft
                  ? `The selected recipie items will be made visible to users.`
                  : `The selected recipie items will no longer be visible to users.`,
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
            >
              <Button
                size="xs"
                leftSection={
                  <recipieItemsProps.draft
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
                title: `${anyActive ? 'Deactivate' : 'Activate'} Recipie Items`,
                desc: anyActive
                  ? `The selected recipie items will no longer be visible to users.`
                  : `Visibility of the recipie items to users will be restored.`,
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
            >
              <Button
                size="xs"
                leftSection={
                  <recipieItemsProps.active
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
                {recipieItems === undefined ? (
                  <Skeleton h={20} w={20} />
                ) : (
                  <Tooltip label={`Select/Deselect all recipie items`}>
                    <Checkbox
                      aria-label={`Select all recipie items`}
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
            <TableTh w={widths.title}>Ingredient</TableTh>
            <TableTh w={widths.product}>Product</TableTh>
            <TableTh w={widths.quantity}>Quantity Needed</TableTh>
            <TableTh w={widths.status}>Status</TableTh>
            <TableTh w={widths.added}>Added</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {recipieItems === undefined ? (
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
        {recipieItems === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {recipieItems === undefined ? (
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
  title: '15%',
  product: '15%',
  quantity: '15%',
  status: '10%',
  added: '15%',
  actions: '10%',
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

    <TableTd w={widths.product}>
      <Skeleton h={16} w={160} />
    </TableTd>

    <TableTd w={widths.quantity}>
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

function BadgeStatus({ props }: { props: RecipieItemGet }) {
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
