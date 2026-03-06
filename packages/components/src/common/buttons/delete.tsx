import React from 'react';
import ModalConfirm from '../modals/confirm';
import { Button } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IconTrash } from '@tabler/icons-react';

export default function Delete({
  props,
}: {
  props: { anyActive?: string; onConfirm: () => void };
}) {
  return (
    <ModalConfirm
      props={{
        title: `Delete Items`,
        desc: `This will remove all data associated with the selected items. This action is irreversible.`,
        onConfirm: props.onConfirm,
        confirmMessage: `The selected deliveries and all data associated with them has been removed.`,
      }}
    >
      <Button
        size="xs"
        color="blue"
        leftSection={<IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
      >
        Delete Item(s)
      </Button>
    </ModalConfirm>
  );
}
