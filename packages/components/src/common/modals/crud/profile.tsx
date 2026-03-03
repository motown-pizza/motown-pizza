'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormProfile from '@/components/form/profile';
import { ProfileGet } from '@repo/types/models/profile';

export default function Profile({
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
            title: `${props?.defaultValues?.updated_at ? 'Edit' : 'Add'} Member`,
            close,
          }}
        >
          <FormProfile props={{ defaultValues: props?.defaultValues, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
