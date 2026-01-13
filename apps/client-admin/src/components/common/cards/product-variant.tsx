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
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { capitalizeWords } from '@repo/utilities/string';
import React from 'react';
import ModalCrudProductVariant from '../modals/crud/product-variant';
import classes from './product-variant.module.scss';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconMilk,
  IconMilkOff,
  IconTrash,
} from '@tabler/icons-react';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useProductVariantActions } from '@/hooks/actions/product-variant';
import { Status } from '@repo/types/models/enums';

export default function ProductVariant({
  props,
}: {
  props: ProductVariantGet;
}) {
  const { productVariantUpdate, productVariantDelete } =
    useProductVariantActions();

  const active = props.status == Status.ACTIVE;
  const draft = props.status == Status.DRAFT;
  const productVariantProps = {
    icon: {
      active: active ? IconMilkOff : IconMilk,
      draft: IconArrowUp,
    },
  };

  return (
    <Card padding={'xs'} radius={0} className={classes.card}>
      <Group justify="space-between" align="start">
        <Stack gap={'xs'}>
          <Title order={3} fz={'sm'} fw={500}>
            {props.title}
          </Title>

          {/* <Text fz={'sm'} c={'dimmed'}>
            Size:{' '}
            <Text component="span" inherit c={'ter'}>
              {capitalizeWords(props.size)}
            </Text>
          </Text> */}

          <Group gap={5}>
            {draft && (
              <ModalConfirm
                props={{
                  title: `${draft ? 'Publish' : 'Unpublish'} Variant`,
                  desc: draft
                    ? `(${props.title}) will be made visible to users and staff.`
                    : `The item (${props.title}) will no longer be visible to users and staff.`,
                  onConfirm: () =>
                    productVariantUpdate({
                      ...props,
                      status: draft ? Status.ACTIVE : Status.DRAFT,
                    }),
                  confirmMessage: draft
                    ? `(${props.title}) is now visible to users and staff.`
                    : `(${props.title}) is no longer be visible to users and staff.`,
                }}
              >
                <Group>
                  <Tooltip label={`${draft ? 'Publish' : 'Unpublish'} Variant`}>
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      variant="light"
                      color={draft ? 'green' : 'yellow'}
                    >
                      <productVariantProps.icon.draft
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </ModalConfirm>
            )}

            <ModalCrudProductVariant props={{ defaultValues: props }}>
              <Group>
                <Tooltip label={'Edit Variant'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="light">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCrudProductVariant>

            <ModalConfirm
              props={{
                title: `${active ? 'Deactivate' : 'Activate'} Variant`,
                desc: active
                  ? `The item (${props.title}) will no longer be visible to users.`
                  : `Visibility of the item (${props.title}) to users will be restored.`,
                onConfirm: () =>
                  productVariantUpdate({
                    ...props,
                    status: active ? Status.INACTIVE : Status.ACTIVE,
                  }),
                confirmMessage: active
                  ? `(${props.title}) is no longer visible to users.`
                  : `Visibility of ${props.title} to users is restored.`,
              }}
            >
              <Group>
                <Tooltip
                  label={
                    draft
                      ? 'Item needs to be published first'
                      : `${active ? 'Deactivate' : 'Activate'} Variant`
                  }
                >
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="light"
                    color={active ? 'yellow' : 'green'}
                    disabled={draft}
                  >
                    <productVariantProps.icon.active
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalConfirm>

            <ModalConfirm
              props={{
                title: `Delete Variant`,
                desc: `This will remove all data associated with the item (${props.title}). This action is irreversible.`,
                onConfirm: () => productVariantDelete(props),
                confirmMessage: `(${props.title}) and all data associated with it has been removed.`,
              }}
            >
              <Group>
                <Tooltip label={'Delete Variant'}>
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
        </Stack>

        <Stack gap={'xs'} align="end">
          <Text fz={'sm'} c={'dimmed'} ta={'end'}>
            Kshs.{' '}
            <Text component="span" inherit c={'sec'}>
              <NumberFormatter value={props.price} suffix="" />
            </Text>
            /-
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
