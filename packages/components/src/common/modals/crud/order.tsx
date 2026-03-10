import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormOrder from '@repo/components/form/stores/order';
import { OrderGet } from '@repo/types/models/order';

export default function Order({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<OrderGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        padding={0}
      >
        <LayoutModal
          props={{
            close,
            title: `${props?.defaultValues?.updated_at ? 'Edit' : 'Add'} Order`,
          }}
        >
          <FormOrder props={{ options: { close } }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
