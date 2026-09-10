import React from 'react';
import { typeParams } from '../layout';
import PartialPageDetailsProfile from '@admin/ui/partial/page/details/profile';

export default async function Profile({ params }: { params: Promise<typeParams> }) {
  const profileId = (await params).profileId;

  return (
    <div>
      <PartialPageDetailsProfile props={{ itemId: profileId }} />
    </div>
  );
}
