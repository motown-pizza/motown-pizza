'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Stack, Text } from '@mantine/core';
import FormAuth from '@/components/form/auth';
import { AuthAction } from '@repo/types/enums';
import { AUTH_URLS } from '@/data/constants';
import NextLink from '@repo/components/common/anchor/next-link';

export default function SignIn({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <Stack>
          <FormAuth
            action={AuthAction.SIGN_IN}
            header={{
              title: 'Welcome Back!',
              desc: 'Sign in to access your personalized experience.',
            }}
          />

          <Text fz={'xs'} ta={'center'}>
            Don&apos;t have an account?{' '}
            <NextLink
              inherit
              fw={500}
              href={AUTH_URLS.SIGN_UP}
              underline="hover"
            >
              Sign Up
            </NextLink>
          </Text>
        </Stack>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
