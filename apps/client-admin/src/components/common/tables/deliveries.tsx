'use client';

import React from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
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
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconAsterisk, IconEye, IconTrash } from '@tabler/icons-react';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useDeliveryActions } from '@repo/hooks/actions/delivery';
import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { DeliveryGet } from '@repo/types/models/delivery';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useClipboard } from '@mantine/hooks';
import { useTableListing } from '@repo/hooks/table-listing';
import BadgeStatus from '@repo/components/common/badges/status';
import PartialTableHeader from '@repo/components/partial/table/header';
import PartialTableMain from '@repo/components/partial/table/main';
import PartialTableFooter from '@repo/components/partial/table/footer';
import CheckboxTable from '@repo/components/common/checkboxes/table';
import ButtonDelete from '@repo/components/common/buttons/delete';

export default function Deliveries() {
  const { deliveries } = useStoreDelivery();
  const { orders } = useStoreOrder();
  const { deliveryDelete } = useDeliveryActions();

  const filteredItems = deliveries;

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
    const orderCurrent = orders?.find((oi) => oi.id == p.order_id);

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
            <Avatar
              key={orderCurrent?.customer_name}
              name={orderCurrent?.customer_name}
              size={36}
              color="initials"
            />

            <Stack gap={0} align="start">
              <Tooltip label={orderCurrent?.customer_name} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {orderCurrent?.customer_name}
                </Title>
              </Tooltip>

              <Tooltip label={orderCurrent?.tracking_code} multiline maw={240}>
                <Text c={'dimmed'} fz={'sm'} lineClamp={1}>
                  <Text component="span" inherit>
                    {orderCurrent?.tracking_code}
                  </Text>
                </Text>
              </Tooltip>
            </Stack>
          </Group>
        </TableTd>

        <TableTd w={widths.schedule}>
          <Stack gap={0} align="start">
            <Text lineClamp={1}>
              {!p.scheduled_window_start
                ? 'Not Scheduled'
                : getRegionalDate(p.scheduled_window_start).date}
            </Text>
          </Stack>
        </TableTd>

        <TableTd w={widths.status}>
          <BadgeStatus props={p} />
        </TableTd>

        <TableTd w={widths.fee}>
          <NumberFormatter value={p.delivery_fee || 250} prefix="Kes. " />
        </TableTd>

        <TableTd w={widths.code}>
          <CodeComponent props={p} />
        </TableTd>

        <TableTd w={widths.dispatch}>
          <Stack gap={0} align="start">
            <Text lineClamp={1}>
              {!p.dispatched_at
                ? 'Not Dispatched'
                : getRegionalDate(p.dispatched_at).date}
            </Text>
          </Stack>
        </TableTd>

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
                title: `Delete Delivery`,
                desc: `This will remove all data associated with the delivery for (${orderCurrent?.customer_name}). This action is irreversible.`,
                onConfirm: () => deliveryDelete(p),
                confirmMessage: `(${orderCurrent?.customer_name}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Delivery'}>
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
            {selectedRows.length > 0 && (
              <ButtonDelete
                props={{
                  onConfirm: () => {
                    if (selectedRows.length == 1) {
                      const delivery = deliveries?.find(
                        (di) => di.id == selectedRows[0]
                      );

                      if (delivery) deliveryDelete(delivery);
                    } else {
                      const filteredDeliveries = deliveries?.filter(
                        (di) => !selectedRows.includes(di.id)
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
        <TableTh w={widths.title}>Recipient</TableTh>
        <TableTh w={widths.schedule}>Scheduled Start</TableTh>
        <TableTh w={widths.status}>Status</TableTh>
        <TableTh w={widths.fee}>Fee</TableTh>
        <TableTh w={widths.code}>Code</TableTh>
        <TableTh w={widths.dispatch}>Dispatched At</TableTh>
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
  schedule: '15%',
  status: '10%',
  fee: '10%',
  code: '15%',
  dispatch: '15%',
  actions: '5%',
};

function CodeComponent({ props }: { props: DeliveryGet }) {
  const clipboard = useClipboard({ timeout: 3000 });

  return (
    <Group gap={'xs'}>
      {!clipboard.copied ? (
        <Group gap={0}>
          <IconAsterisk size={10} stroke={ICON_STROKE_WIDTH} />
          <IconAsterisk size={10} stroke={ICON_STROKE_WIDTH} />
          <IconAsterisk size={10} stroke={ICON_STROKE_WIDTH} />
          <IconAsterisk size={10} stroke={ICON_STROKE_WIDTH} />
        </Group>
      ) : (
        <Text inherit miw={40}>
          {props.verfication_code}
        </Text>
      )}

      {!clipboard.copied && (
        <Tooltip label={'Reveal code'}>
          <ActionIcon
            size={ICON_WRAPPER_SIZE}
            color={'dark'}
            variant="subtle"
            onClick={() => clipboard.copy(props.verfication_code)}
          >
            <IconEye size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
