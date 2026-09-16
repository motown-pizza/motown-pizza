import React from 'react';
import { Metadata } from 'next';
import { NotifySignOut as PartialNotifySignOut } from '@repo/ui';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Sign Out' };

export default async function SignOut() {
  return (
    <div>
      <PartialNotifySignOut props={{ baseUrl: (await getBaseUrl()).WEB }} />
    </div>
  );
}
