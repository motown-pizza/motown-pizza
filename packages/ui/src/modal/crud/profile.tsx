'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { LayoutModal } from '../../layout/modal';
import { FormStoresProfile } from '../../form/stores/profile';
import { ProfileGet } from '@repo/types';

export function ModalCrudProfile({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<ProfileGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updatedAt ? 'Edit' : 'Add'} Member`,
            close,
          }}
        >
          <FormStoresProfile props={{ defaultValues: props?.defaultValues, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
