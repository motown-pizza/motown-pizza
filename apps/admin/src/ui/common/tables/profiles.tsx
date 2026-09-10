'use client';

import React from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Stack,
  TableTd,
  TableTh,
  TableTr,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useStoreProfile } from '@repo/store';
import { initialize } from '@repo/utils';
import { getRegionalDate } from '@repo/utils';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { ProfileGet } from '@repo/types';
import { Role, Status, SyncStatus } from '@repo/types';
import { IconEdit, IconPlus, IconTrash, IconUser, IconUserOff } from '@tabler/icons-react';
import { ModalConfirm } from '@repo/ui';
import { useProfileActions } from '@repo/store';
import { useTableListing } from '@repo/hooks';
import { BadgeStatus } from '@repo/ui';
import { PartialTableHeader } from '@repo/ui';
import { PartialTableMain } from '@repo/ui';
import { PartialTableFooter } from '@repo/ui';
import { CheckboxTable } from '@repo/ui';
import { ButtonActivate } from '@repo/ui';
import Link from 'next/link';

export default function Profiles({ props }: { props?: { profiles?: ProfileGet[] } }) {
  const { profiles, setProfiles } = useStoreProfile();
  const { profileUpdate, profileDelete } = useProfileActions();

  const filteredItems = props?.profiles || profiles;

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
    const fullName = `${p.firstName} ${p.lastName}`;
    const dates = {
      created: getRegionalDate(p.createdAt),
    };
    const active = p.status == Status.ACTIVE;
    const profileProps = {
      icon: active ? IconUserOff : IconUser,
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
            <Group>
              <Tooltip label={'Edit User'}>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE - 4}
                  variant="light"
                  component={Link}
                  href={`/dashboard/people/${p.id}`}
                >
                  <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>

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
                    <profileProps.icon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
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

  const profilesProps = {
    icon: anyActive ? IconUserOff : IconUser,
  };

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
          href={`/dashboard/people/new`}
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
                href={`/dashboard/people/${selectedRows[0]}`}
              >
                Edit Item
              </Button>
            )}

            <ButtonActivate
              props={{
                anyActive,
                onConfirm: () =>
                  setProfiles(
                    profiles?.map((p) => {
                      if (!selectedRows.includes(p.id)) return p;

                      return {
                        ...p,
                        syncStatus: SyncStatus.PENDING,
                        status: anyActive ? Status.INACTIVE : Status.ACTIVE,
                      };
                    }),
                  ),
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
        <TableTh w={widths.name}>Name</TableTh>
        <TableTh w={widths.role}>Role</TableTh>
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
  name: '35%',
  role: '15%',
  status: '15%',
  added: '20%',
  actions: '10%',
};

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
