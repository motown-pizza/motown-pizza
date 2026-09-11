import React from 'react';
import { ModalConfirm } from '../modal/confirm';
import { Button } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

export function ButtonPublish({ props }: { props: { anyDraft?: string; onConfirm: () => void } }) {
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
        leftSection={<productsProps.draft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
      >
        {props.anyDraft ? 'Publish' : 'Unpublish'}
      </Button>
    </ModalConfirm>
  );
}
