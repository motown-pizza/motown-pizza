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
import { useStoreProfile } from '@/libraries/zustand/stores/profile';
import { initialize } from '@repo/utilities/string';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { ProfileGet } from '@repo/types/models/profile';
import { Role, Status, SyncStatus } from '@repo/types/models/enums';
import {
  IconEdit,
  IconTrash,
  IconUser,
  IconUserEdit,
  IconUserOff,
} from '@tabler/icons-react';
import { usePaginate } from '@repo/hooks/paginate';
import ModalCrudProfile from '../modals/crud/profile';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useProfileActions } from '@/hooks/actions/profile';

export default function Profiles({
  props,
}: {
  props?: { profiles?: ProfileGet[] };
}) {
  const { profiles, setProfiles } = useStoreProfile();
  const { profileUpdate, profileDelete } = useProfileActions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredItems = props?.profiles || profiles || [];

  const { items, activePage, setActivePage, totalPages, pageRange } =
    usePaginate(
      sortArray(filteredItems, (v) => v.created_at, Order.DESCENDING),
      5
    );

  const rows = items.map((p) => {
    const fullName = `${p.first_name} ${p.last_name}`;
    const dates = {
      created: getRegionalDate(p.created_at),
    };
    const active = p.status == Status.ACTIVE;
    const profileProps = {
      icon: active ? IconUserOff : IconUser,
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
              aria-label={`Select ${fullName}`}
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

        <TableTd w={widths.name}>
          <Group gap={'xs'} wrap="nowrap">
            <Avatar src={p.avatar} name={fullName} color="initials">
              {initialize(fullName)}
            </Avatar>

            <Stack gap={0} align="start">
              <Tooltip label={fullName} multiline maw={240}>
                <Title order={3} fz={'md'} fw={500} lineClamp={1}>
                  {fullName}
                </Title>
              </Tooltip>

              <Tooltip label={p.email} multiline maw={240}>
                <Text c={'dimmed'} fz={'sm'} lineClamp={1}>
                  {p.email}
                </Text>
              </Tooltip>
            </Stack>
          </Group>
        </TableTd>

        <TableTd w={widths.role}>
          <BadgeRole props={p} />
        </TableTd>

        <TableTd w={widths.status}>
          <BadgeStatus props={p} />
        </TableTd>

        <TableTd
          w={widths.added}
        >{`${dates.created.date}, ${dates.created.time.toUpperCase()}`}</TableTd>

        <TableTd w={widths.actions}>
          <Group gap={'xs'} justify="end" wrap="nowrap">
            <ModalCrudProfile props={{ defaultValues: p }}>
              <Group>
                <Tooltip label={'Edit User'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudProfile>

            <ModalConfirm
              props={{
                title: `${active ? 'Deactivate' : 'Activate'} User`,
                desc: active
                  ? `The user (${fullName}) will no longer be able to sign in.`
                  : `The functions of the user (${fullName}) will be restored.`,
                onConfirm: () =>
                  profileUpdate({
                    ...p,
                    status: active ? Status.INACTIVE : Status.ACTIVE,
                  }),
                confirmMessage: active
                  ? `(${fullName}) is no longer visible to users.`
                  : `Visibility of ${fullName} to users is restored.`,
              }}
            >
              <Group>
                <Tooltip label={`${active ? 'Deactivate' : 'Activate'} User`}>
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="light"
                    color={active ? 'yellow' : 'green'}
                  >
                    <profileProps.icon
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `Delete User`,
                desc: `This will remove all data associated with the item (${fullName}). This action is irreversible.`,
                onConfirm: () => profileDelete(p),
                confirmMessage: `(${fullName}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete User'}>
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

  const profilesProps = {
    icon: anyActive ? IconUserOff : IconUser,
  };

  return (
    <div>
      <Group justify="space-between" mih={30}>
        <Group>
          {profiles === undefined ? (
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
              <ModalCrudProfile
                props={{
                  defaultValues: filteredItems?.find(
                    (p) => p.id == selectedRows[0]
                  ),
                }}
              >
                <Button
                  size="xs"
                  leftSection={
                    <IconUserEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                >
                  Edit User
                </Button>
              </ModalCrudProfile>
            )}

            <ModalConfirm
              props={{
                title: `${anyActive ? 'Deactivate' : 'Activate'} Users`,
                desc: anyActive
                  ? `The selected users will no longer be able to sign in.`
                  : `The selected users' functions will be restored.`,
                onConfirm: () =>
                  setProfiles(
                    profiles?.map((p) => {
                      if (!selectedRows.includes(p.id)) return p;

                      return {
                        ...p,
                        sync_status: SyncStatus.PENDING,
                        status: anyActive ? Status.INACTIVE : Status.ACTIVE,
                      };
                    })
                  ),
              }}
            >
              <Button
                size="xs"
                leftSection={
                  <profilesProps.icon
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
                {profiles === undefined ? (
                  <Skeleton h={20} w={20} />
                ) : (
                  <Tooltip label={`Select/Deselect all users`}>
                    <Checkbox
                      aria-label={`Select all users`}
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
            <TableTh w={widths.name}>Name</TableTh>
            <TableTh w={widths.role}>Role</TableTh>
            <TableTh w={widths.status}>Status</TableTh>
            <TableTh w={widths.added}>Added</TableTh>
            <TableTh w={widths.actions} />
          </TableTr>
        </TableThead>

        <TableTbody>
          {profiles === undefined ? (
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
        {profiles === undefined ? (
          <Skeleton h={20} w={120} />
        ) : !pageRange ? null : (
          <Text>
            Showing: <NumberFormatter value={pageRange?.from} /> to{' '}
            <NumberFormatter value={pageRange?.to} />
          </Text>
        )}

        <Group justify="end">
          {profiles === undefined ? (
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
  name: '35%',
  role: '15%',
  status: '15%',
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

    <TableTd w={widths.name}>
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

    <TableTd w={widths.role}>
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

function BadgeStatus({ props }: { props: ProfileGet }) {
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

function BadgeRole({ props }: { props: ProfileGet }) {
  const badgeProps = {
    color: '',
  };

  switch (props.role) {
    case Role.ADMIN:
      badgeProps.color = 'blue';
      break;
    case Role.DEV:
      badgeProps.color = 'yellow';
      break;
    case Role.USER:
      badgeProps.color = 'pink';
      break;
    case Role.EMPLOYEE:
      badgeProps.color = 'orange';
      break;
    case Role.SUPERVISOR:
      badgeProps.color = 'violet';
      break;
    case Role.TRANSPORTER:
      badgeProps.color = 'indigo';
      break;

    default:
      break;
  }

  return (
    <Badge variant="light" color={`${badgeProps.color}.6`}>
      {props.role}
    </Badge>
  );
}
