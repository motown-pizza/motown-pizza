'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { FormContact, LayoutModal } from '@repo/ui';

export default function LoyaltyProgram({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          props={{
            close,
            title: 'Join Loyalty Program',
          }}
        >
          <FormContact props={{ subject: 'Join Loyalty Program' }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
