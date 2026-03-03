'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Stack } from '@mantine/core';
import FormAuth from '@repo/components/form/auth';
import { AuthAction } from '@repo/types/enums';
import { BASE_URL_CLIENT } from '@repo/constants/paths';

export default function SignIn({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <Stack>
          <FormAuth
            baseUrl={BASE_URL_CLIENT.WEB}
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
