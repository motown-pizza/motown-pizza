'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormContact from '@/components/form/contact';

export default function Feedback({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Share Feedback">
        <FormContact props={{ subject: 'User Feedback' }} />
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
