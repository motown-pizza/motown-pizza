import React from 'react';
import { Metadata } from 'next';
import { FormAuth } from '@repo/ui';
import { AuthAction } from '@repo/types';
import { BASE_URL } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Sign In' };

export default function SignIn() {
  return (
    <div>
      <FormAuth
        action={AuthAction.SIGN_IN}
        header={{
          title: 'Welcome Back!',
          desc: 'Sign in to access your personalized experience.',
        }}
        baseUrl={BASE_URL.ADMIN}
      />
    </div>
  );
}
