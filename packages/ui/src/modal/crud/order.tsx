import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Modal } from '@mantine/core';
import { LayoutModal } from '../../layout/modal';
import { FormStoresOrder } from '../../form/stores/order';
import { OrderGet } from '@repo/types';

export function ModalCrudOrder({
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
        size={'lg'}
        // size={'fit-content'}
      >
        <Box maw={1000}>
          <LayoutModal
            props={{
              close,
              title: `${props?.defaultValues?.updatedAt ? 'Edit' : 'Add'} Order`,
            }}
          >
            <FormStoresOrder props={{ source: 'pos', options: { close } }} />
          </LayoutModal>
        </Box>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
