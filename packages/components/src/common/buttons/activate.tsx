import React from 'react';
import ModalConfirm from '../modals/confirm';
import { Button } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import {
  IconArrowDown,
  IconArrowUp,
  IconMilk,
  IconMilkOff,
} from '@tabler/icons-react';

export default function Activate({
  props,
}: {
  props: { anyActive?: string; onConfirm: () => void };
}) {
  const productsProps = {
    active: props.anyActive ? IconMilkOff : IconMilk,
  };

  return (
    <ModalConfirm
      props={{
        title: `${props.anyActive ? 'Deactivate' : 'Activate'} Products`,
        desc: props.anyActive
          ? `The selected products will no longer be visible to users.`
          : `Visibility of the products to users will be restored.`,
        onConfirm: props.onConfirm,
      }}
    >
      <Button
        size="xs"
        color="blue"
        leftSection={
          <productsProps.active size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        }
      >
        {props.anyActive ? 'Deactivate' : 'Activate'}
      </Button>
    </ModalConfirm>
  );
}
