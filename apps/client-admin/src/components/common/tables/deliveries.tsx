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
import { DeliveryStatus } from '@repo/types/models/enums';
import { IconAsterisk, IconEye, IconTrash } from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
import { sortArray } from '@repo/utilities/array';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useDeliveryActions } from '@repo/hooks/actions/delivery';
import { useStoreDelivery } from '@repo/libraries/zustand/stores/delivery';
import { DeliveryGet } from '@repo/types/models/delivery';
import { Order } from '@repo/types/enums';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useClipboard } from '@mantine/hooks';

export default function Deliveries() {
  const { deliveries } = useStoreDelivery();
  const { orders } = useStoreOrder();
  const { deliveryDelete } = useDeliveryActions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = deliveries || [];

  const { items, activePage, setActivePage, totalPages, pageRange } =
    usePaginate(
      sortArray(filteredItems, (v) => v.created_at, Order.DESCENDING),
      15
    );

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
          <Center>
            <Checkbox
              aria-label={`Select delivery for ${orderCurrent?.customer_name}`}
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
      <Group justify="space-between" mih={30}>
        <Group>
          {deliveries === undefined ? (
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
                  title: `Delete Deliveries`,
                  desc: `This will remove all data associated with the selected deliveries. This action is irreversible.`,
                  // onConfirm: () => deliveryDelete(p),
                  confirmMessage: `The selected deliveries and all data associated with them has been removed.`,
                }}
              >
                <Button
                  size="xs"
                  leftSection={
                    <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                >
                  Delete Delivery(s)
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
                {deliveries === undefined ? (
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
            <TableTh w={widths.title}>Recipient</TableTh>
            <TableTh w={widths.schedule}>Scheduled Start</TableTh>
            <TableTh w={widths.status}>Status</TableTh>
            <TableTh w={widths.fee}>Fee</TableTh>
            <TableTh w={widths.code}>Code</TableTh>
            <TableTh w={widths.dispatch}>Dispatched At</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {deliveries === undefined ? (
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
        {deliveries === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {deliveries === undefined ? (
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
  schedule: '15%',
  status: '10%',
  fee: '10%',
  code: '15%',
  dispatch: '15%',
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

    <TableTd w={widths.schedule}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.status}>
      <Skeleton h={20} w={'60%'} />
    </TableTd>

    <TableTd w={widths.fee}>
      <Skeleton h={20} w={'60%'} />
    </TableTd>

    <TableTd w={widths.code}>
      <Skeleton h={20} w={'75%'} />
    </TableTd>

    <TableTd w={widths.dispatch}>
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

function BadgeStatus({ props }: { props: DeliveryGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.delivery_status) {
    case DeliveryStatus.PENDING:
      badgeProps.color = 'cyan';
      break;
    case DeliveryStatus.CANCELLED:
      badgeProps.color = 'red';
      break;
    case DeliveryStatus.DELIVERED:
      badgeProps.color = 'green';
      break;
    case DeliveryStatus.FAILED:
      badgeProps.color = 'red';
      break;
    case DeliveryStatus.OUT_FOR_DELIVERY:
      badgeProps.color = 'violet';
      break;
    case DeliveryStatus.RETURNED:
      badgeProps.color = 'yellow';
      break;
    case DeliveryStatus.SHCEDULED:
      badgeProps.color = 'blue';
      break;

    default:
      break;
  }

  return (
    <Badge variant="dot" color={`${badgeProps.color}.9`}>
      {props.delivery_status}
    </Badge>
  );
}

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
