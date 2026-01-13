'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormRecipieItem from '@/components/form/recipie-item';
import { RecipieItemGet } from '@repo/types/models/recipie-item';

export default function RecipieItem({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<RecipieItemGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updated_at ? 'Edit' : 'Add'} Recipie Item`,
            close,
          }}
        >
          <FormRecipieItem
            props={{ defaultValues: props?.defaultValues, close }}
          />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
