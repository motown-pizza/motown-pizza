'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormProduct from '@/components/form/product';
import { ProductGet } from '@repo/types/models/product';

export default function Product({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<ProductGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        padding={0}
      >
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updated_at ? 'Edit' : 'Add'} Product`,
            close,
          }}
        >
          <FormProduct props={{ defaultValues: props?.defaultValues, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
