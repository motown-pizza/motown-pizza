import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import { typeParams } from '../layout';
import PartialPageDetailsProfile from '@/components/partial/page/details/profile';

export default async function Profile({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const profileId = (await params).profileId;

  return (
    <LayoutPage>
      <PartialPageDetailsProfile props={{ itemId: profileId }} />
    </LayoutPage>
  );
}
