'use client';

import React from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Center,
  Group,
  Stack,
  TableTd,
  TableTh,
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
} from '@repo/constants/sizes';
import {
  OrderFulfilmentType,
  OrderSource,
  OrderStatus,
} from '@repo/types/models/enums';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useOrderActions } from '@repo/hooks/actions/order';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { OrderGet } from '@repo/types/models/order';
import { useTableListing } from '@repo/hooks/table-listing';
import PartialTableHeader from '@repo/components/partial/table/header';
import PartialTableMain from '@repo/components/partial/table/main';
import PartialTableFooter from '@repo/components/partial/table/footer';
import CheckboxTable from '@repo/components/common/checkboxes/table';
import ButtonDelete from '@repo/components/common/buttons/delete';
import Link from 'next/link';

export default function Orders() {
  const { orders } = useStoreOrder();
  const { orderDelete } = useOrderActions();

  const filteredItems = orders?.filter(
    (oi) => oi.order_status != OrderStatus.DRAFT
  );

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
  } = useTableListing({ list: filteredItems || [] });

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
          <CheckboxTable
            props={{
              list: filteredItems,
              selectedRows,
              setSelectedRows,
              options: { head: true, itemId: p.id },
            }}
          />
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

            {selectedRows.length > 0 && (
              <ButtonDelete
                props={{
                  onConfirm: () => {
                    if (selectedRows.length == 1) {
                      const order = orders?.find(
                        (i) => i.id == selectedRows[0]
                      );

                      if (order) orderDelete(order);
                    } else {
                      const filteredOrder = orders?.filter(
                        (i) => !selectedRows.includes(i.id)
                      );
                    }
                  },
                }}
              />
            )}
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
        <TableTh w={widths.code}>Code</TableTh>
        <TableTh w={widths.title}>Ordered By</TableTh>
        <TableTh w={widths.fulfilmentType}>Fulfilment Type</TableTh>
        <TableTh w={widths.source}>Source</TableTh>
        <TableTh w={widths.dateOrdered}>Placed On</TableTh>
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
  title: '25%',
  fulfilmentType: '15%',
  source: '10%',
  code: '20%',
  dateOrdered: '20%',
  actions: '5%',
};

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
