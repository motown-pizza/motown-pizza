'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Avatar,
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
import { useStoreProduct } from '@/libraries/zustand/stores/product';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { ProductGet } from '@repo/types/models/product';
import {
  ProductDietaryType,
  ProductType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconTrash,
} from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
import ModalCrudProduct from '../modals/crud/product';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useProductActions } from '@/hooks/actions/product';
import { useStoreProductVariant } from '@/libraries/zustand/stores/product-variant';
import { useStoreRecipieItem } from '@/libraries/zustand/stores/recipie-item';
import { useStoreIngredient } from '@/libraries/zustand/stores/ingredient';

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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = props?.products || products || [];

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
          <Center>
            <Checkbox
              aria-label={`Select ${p.title}`}
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
            <Avatar src={p.image} />

            <Stack gap={0} align="start">
              <Tooltip label={p.title} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {p.title}
                </Title>
              </Tooltip>

              <Tooltip label={content} multiline maw={240}>
                <Text c={'dimmed'} fz={'sm'} lineClamp={1}>
                  <Text component="span">{content}</Text>
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

        <TableTd w={widths.type}>
          <BadgeType props={p} />
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

  const anyActive = selectedRows?.find((iid) => {
    return filteredItems?.find((p) => p.id == iid)?.status == Status.ACTIVE;
  });

  const anyDraft = selectedRows?.find((iid) => {
    return filteredItems?.find((p) => p.id == iid)?.status == Status.DRAFT;
  });

  const productsProps = {
    active: anyActive ? IconMilkOff : IconMilk,
    draft: anyDraft ? IconArrowUp : IconArrowDown,
  };

  return (
    <div>
      <Group justify="space-between" mih={30}>
        <Group>
          {products === undefined ? (
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
              <ModalCrudProduct
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
                  Edit Product
                </Button>
              </ModalCrudProduct>
            )}

            <ModalConfirm
              props={{
                title: `${anyDraft ? 'Publish' : 'Unpublish'} Ingredients`,
                desc: anyDraft
                  ? `The selected ingredients will be made visible to users.`
                  : `The selected ingredients will no longer be visible to users.`,
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
            >
              <Button
                size="xs"
                leftSection={
                  <productsProps.draft
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
                title: `${anyActive ? 'Deactivate' : 'Activate'} Products`,
                desc: anyActive
                  ? `The selected products will no longer be visible to users.`
                  : `Visibility of the products to users will be restored.`,
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
            >
              <Button
                size="xs"
                leftSection={
                  <productsProps.active
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
                {products === undefined ? (
                  <Skeleton h={20} w={20} />
                ) : (
                  <Tooltip label={`Select/Deselect all products`}>
                    <Checkbox
                      aria-label={`Select all products`}
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
            <TableTh w={widths.type}>Type</TableTh>
            <TableTh w={widths.dietaryClass}>Diet Class</TableTh>
            <TableTh w={widths.status}>Status</TableTh>
            <TableTh w={widths.added}>Added</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {products === undefined ? (
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
        {products === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {products === undefined ? (
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
  title: '35%',
  type: '10%',
  dietaryClass: '10%',
  status: '10%',
  added: '20%',
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
      <Group gap={'xs'}>
        <Skeleton
          h={ICON_WRAPPER_SIZE + 10}
          w={ICON_WRAPPER_SIZE + 10}
          radius={999}
        />

        <Stack gap={5}>
          <Skeleton h={16} w={160} />
          <Skeleton h={16} w={240} />
        </Stack>
      </Group>
    </TableTd>

    <TableTd w={widths.type}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.dietaryClass}>
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

function BadgeStatus({ props }: { props: ProductGet }) {
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

function BadgeType({ props }: { props: ProductGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.type) {
    case ProductType.PIZZA:
      badgeProps.color = 'blue';
      break;
    case ProductType.DRINK:
      badgeProps.color = 'yellow';
      break;
    case ProductType.SIDE:
      badgeProps.color = 'pink';
      break;

    default:
      break;
  }

  return <Badge color={`${badgeProps.color}.6`}>{props.type}</Badge>;
}

function BadgeDietType({ props }: { props: ProductGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.dietary_class) {
    case ProductDietaryType.MEATY:
      badgeProps.color = 'orange';
      break;
    case ProductDietaryType.VEGGIE:
      badgeProps.color = 'lime';
      break;
    case ProductDietaryType.VEGAN:
      badgeProps.color = 'pink';
      break;
    case ProductDietaryType.NEUTRAL:
      badgeProps.color = 'blue';
      break;

    default:
      break;
  }

  return (
    <Badge variant="light" color={`${badgeProps.color}.6`}>
      {props.dietary_class}
    </Badge>
  );
}
