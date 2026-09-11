import React from 'react';
import {
  ActionIcon,
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { RecipieItemGet } from '@repo/types';
import { ModalCrudRecipieItem } from '../modal/crud/recipie-item';
import classes from './recipie-item.module.css';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconArrowUp, IconChefHat, IconChefHatOff, IconEdit, IconTrash } from '@tabler/icons-react';
import { ModalConfirm } from '../modal/confirm';
import { useRecipieItemActions } from '@repo/store';
import { useStoreIngredient } from '@repo/store';
import { capitalizeWords } from '@repo/utils';
import { Status } from '@repo/types';

export function CardRecipieItem({ props }: { props: RecipieItemGet }) {
  const { recipieItemUpdate, recipieItemDelete } = useRecipieItemActions();

  const { ingredients } = useStoreIngredient();

  const recipieIngredient = ingredients?.find((ii) => ii.id == props.ingredientId);

  const active = props.status == Status.ACTIVE;
  const draft = props.status == Status.DRAFT;
  const recipieItemProps = {
    icon: {
      active: active ? IconChefHatOff : IconChefHat,
      draft: IconArrowUp,
    },
  };

  return (
    <Card padding={'xs'} radius={0} className={classes.card}>
      <Group justify="space-between" align="start">
        <Stack gap={0}>
          <Title order={3} fz={'sm'} fw={500}>
            {recipieIngredient?.name}
          </Title>

          <Text fz={'xs'} c={'dimmed'}>
            <Text component="span" inherit c={'sec'}>
              <NumberFormatter value={props.quantityNeeded} />
            </Text>{' '}
            {capitalizeWords(props.unit)}
          </Text>
        </Stack>

        <Stack gap={'xs'} align="end">
          <Group gap={5}>
            {draft && (
              <ModalConfirm
                props={{
                  title: `${draft ? 'Publish' : 'Unpublish'} Recipie Item`,
                  desc: draft
                    ? `(${recipieIngredient?.name}) will be made visible to users and staff.`
                    : `The item (${recipieIngredient?.name}) will no longer be visible to users and staff.`,
                  onConfirm: () =>
                    recipieItemUpdate({
                      ...props,
                      status: draft ? Status.ACTIVE : Status.DRAFT,
                    }),
                  confirmMessage: draft
                    ? `(${recipieIngredient?.name}) is now visible to users and staff.`
                    : `(${recipieIngredient?.name}) is no longer be visible to users and staff.`,
                }}
              >
                <Group>
                  <Tooltip label={`${draft ? 'Publish' : 'Unpublish'} Recipie Item`}>
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

            <ModalCrudRecipieItem props={{ defaultValues: props }}>
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
                  ? `The item (${recipieIngredient?.name}) will no longer be visible to users.`
                  : `Visibility of the item (${recipieIngredient?.name}) to users will be restored.`,
                onConfirm: () =>
                  recipieItemUpdate({
                    ...props,
                    status: active ? Status.INACTIVE : Status.ACTIVE,
                  }),
                confirmMessage: active
                  ? `(${recipieIngredient?.name}) is no longer visible to users.`
                  : `Visibility of ${recipieIngredient?.name} to users is restored.`,
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
                    <recipieItemProps.icon.active size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `Delete Recipie Item`,
                desc: `This will remove the item (${recipieIngredient?.name}). This action is irreversible.`,
                onConfirm: () => recipieItemDelete(props),
                confirmMessage: `(${recipieIngredient?.name}) has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Recipie Item'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light" color="red">
                    <IconTrash size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
