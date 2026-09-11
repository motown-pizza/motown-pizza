'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { LayoutModal } from '../../layout/modal';
import { FormStoresProduct } from '../../form/stores/product';
import { ProductGet } from '@repo/types';

export function ModalCrudProduct({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<ProductGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered padding={0}>
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updatedAt ? 'Edit' : 'Add'} Product`,
            close,
          }}
        >
          <FormStoresProduct props={{ defaultValues: props?.defaultValues }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
