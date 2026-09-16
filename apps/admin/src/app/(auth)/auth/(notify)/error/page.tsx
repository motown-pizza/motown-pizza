import React from 'react';
import { Metadata } from 'next';
import { NotifyError as PartialNotifyError } from '@repo/ui';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Authentication Error' };

export default async function Error() {
  return (
    <div>
      <PartialNotifyError props={{ baseUrl: (await getBaseUrl()).ADMIN }} />
    </div>
  );
}
