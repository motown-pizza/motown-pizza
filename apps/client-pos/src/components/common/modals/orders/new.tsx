import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormOrderNew from '../../../form/order/new';

export default function New({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        padding={0}
      >
        <LayoutModal props={{ close, title: 'New Order' }}>
          <FormOrderNew options={{ close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
