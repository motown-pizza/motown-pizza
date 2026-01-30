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
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import {
  OrderFulfilmentType,
  OrderSource,
  OrderStatus,
} from '@repo/types/models/enums';
import { IconTrash } from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useOrderActions } from '@repo/hooks/actions/order';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { OrderGet } from '@repo/types/models/order';

export default function Orders() {
  const { orders } = useStoreOrder();
  const { orderDelete } = useOrderActions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = (orders || []).filter(
    (oi) => oi.order_status != OrderStatus.DRAFT
  );

  const { items, activePage, setActivePage, totalPages, pageRange } =
    usePaginate(
      sortArray(filteredItems, (v) => v.created_at, Order.DESCENDING),
      15
    );

  const rows = items.map((p) => {
    const createdAt = getRegionalDate(p.created_at);

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
              aria-label={`Select ${p.tracking_code}`}
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

        <TableTd w={widths.code}>
          <Stack gap={0} align="start">
            <Title order={3} fz={'sm'} fw={500} lineClamp={1}>
              {p.tracking_code}
            </Title>

            <Text c={'dimmed'} fz={'sm'} lineClamp={1}>
              <Text component="span">{2} items</Text>
            </Text>
          </Stack>
        </TableTd>

        <TableTd w={widths.title}>
          <Group gap={'xs'} wrap="nowrap">
            <Avatar
              key={p.customer_name}
              name={p.customer_name}
              size={36}
              color="initials"
            />

            <Stack gap={0} align="start">
              <Tooltip label={p.customer_name} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {p.customer_name}
                </Title>
              </Tooltip>

              <Tooltip label={p.customer_phone} multiline maw={240}>
                <Text c={'dimmed'} fz={'sm'} lineClamp={1}>
                  <Text component="span" inherit>
                    {p.customer_phone}
                  </Text>
                </Text>
              </Tooltip>
            </Stack>
          </Group>
        </TableTd>

        <TableTd w={widths.fulfilmentType}>
          <BadgeFulfilmentType props={p} />
        </TableTd>

        <TableTd w={widths.source}>
          <BadgeOrderSource props={p} />
        </TableTd>

        <TableTd
          w={widths.dateOrdered}
        >{`${createdAt.date}, ${createdAt.time.toUpperCase()}`}</TableTd>

        <TableTd w={widths.actions}>
          <Group gap={'xs'} justify="end" wrap="nowrap">
            {/* <ModalCrudProduct props={{ defaultValues: p }}>
              <Group>
                <Tooltip label={'Edit Product'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudProduct> */}

            <ModalConfirm
              props={{
                title: `Delete Order`,
                desc: `This will remove all data associated with the order (${p.tracking_code}). This action is irreversible.`,
                onConfirm: () => orderDelete(p),
                confirmMessage: `(${p.tracking_code}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Order'}>
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
          {orders === undefined ? (
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
            {selectedRows.length > 0 && (
              <ModalConfirm
                props={{
                  title: `Delete Order(s)`,
                  desc: `This will remove all data associated with the selected orders. This action is irreversible.`,
                  // onConfirm: () => orderDelete(p),
                  confirmMessage: `The selected order(s) and all data associated with them has been removed.`,
                }}
              >
                <Button
                  size="xs"
                  leftSection={
                    <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                >
                  Delete Order(s)
                </Button>
              </ModalConfirm>
            )}
          </Group>
        )}
      </Group>

      <Table highlightOnHover={rows.length > 0} mt={'xl'}>
        <TableThead>
          <TableTr>
            <TableTh w={widths.selection}>
              <Center>
                {orders === undefined ? (
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
            <TableTh w={widths.code}>Code</TableTh>
            <TableTh w={widths.title}>Ordered By</TableTh>
            <TableTh w={widths.fulfilmentType}>Fulfilment Type</TableTh>
            <TableTh w={widths.source}>Source</TableTh>
            <TableTh w={widths.dateOrdered}>Placed On</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {orders === undefined ? (
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
        {orders === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {orders === undefined ? (
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
  title: '25%',
  fulfilmentType: '15%',
  source: '10%',
  code: '20%',
  dateOrdered: '20%',
  actions: '5%',
};

const sleketons = (
  <TableTr h={59}>
    <TableTd w={widths.selection}>
      <Center>
        <Skeleton h={20} w={20} />
      </Center>
    </TableTd>

    <TableTd w={widths.code}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.title}>
      <Group gap={'xs'} wrap="nowrap">
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

    <TableTd w={widths.fulfilmentType}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.source}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.dateOrdered}>
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

function BadgeFulfilmentType({ props }: { props: OrderGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.fulfillment_type) {
    case OrderFulfilmentType.DINE_IN:
      badgeProps.color = 'green';
      break;
    case OrderFulfilmentType.COLLECTION:
      badgeProps.color = 'blue';
      break;
    case OrderFulfilmentType.DELIVERY:
      badgeProps.color = 'yellow';
      break;

    default:
      break;
  }

  return (
    <Badge variant="light" color={`${badgeProps.color}.9`}>
      {props.fulfillment_type}
    </Badge>
  );
}

function BadgeOrderSource({ props }: { props: OrderGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.source) {
    case OrderSource.POS:
      badgeProps.color = 'blue';
      break;
    case OrderSource.WEBSITE:
      badgeProps.color = 'yellow';
      break;

    default:
      break;
  }

  return <Badge color={`${badgeProps.color}.6`}>{props.source}</Badge>;
}
