'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormContact from '@/components/form/contact';

export default function LoyaltyProgram({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Join Loyalty Program">
        <FormContact props={{ subject: 'Loyalty Program' }} />
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
