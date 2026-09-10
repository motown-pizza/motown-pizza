'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { LayoutModal } from '../../layout/modal';
import { FormStoresRecipieItem } from '../../form/stores/recipie-item';
import { RecipieItemGet } from '@repo/types';

export function ModalCrudRecipieItem({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<RecipieItemGet> };
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
        size={'xl'}
      >
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updatedAt ? 'Edit' : 'Add'} Recipie Item`,
            close,
          }}
        >
          <FormStoresRecipieItem props={{ defaultValues: props?.defaultValues, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
