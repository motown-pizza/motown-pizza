'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormIngredient from '@/components/form/ingredient';
import { IngredientGet } from '@repo/types/models/ingredient';

export default function Ingredient({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<IngredientGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updated_at ? 'Edit' : 'Add'} Ingredient`,
            close,
          }}
        >
          <FormIngredient
            props={{ defaultValues: props?.defaultValues, close }}
          />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
