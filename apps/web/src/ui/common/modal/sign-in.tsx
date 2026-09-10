'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Stack } from '@mantine/core';
import { FormAuth } from '@repo/ui';
import { AuthAction } from '@repo/types';
import { BASE_URL } from '@repo/constants';

export default function SignIn({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <Stack>
          <FormAuth
            baseUrl={BASE_URL.WEB}
            action={AuthAction.SIGN_IN}
            header={{
              title: 'Welcome Back!',
              desc: 'Sign in to access your personalized experience.',
            }}
          />
        </Stack>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
