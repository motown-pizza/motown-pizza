import React from 'react';
import ModalConfirm from '../modals/confirm';
import { Button } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

export default function Publish({
  props,
}: {
  props: { anyDraft?: string; onConfirm: () => void };
}) {
  const productsProps = {
    draft: props.anyDraft ? IconArrowUp : IconArrowDown,
  };

  return (
    <ModalConfirm
      props={{
        title: `${props.anyDraft ? 'Publish' : 'Unpublish'} Ingredients`,
        desc: props.anyDraft
          ? `The selected ingredients will be made visible to users.`
          : `The selected ingredients will no longer be visible to users.`,
        onConfirm: props.onConfirm,
      }}
    >
      <Button
        size="xs"
        color="blue"
        leftSection={
          <productsProps.draft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        }
      >
        {props.anyDraft ? 'Publish' : 'Unpublish'}
      </Button>
    </ModalConfirm>
  );
}
