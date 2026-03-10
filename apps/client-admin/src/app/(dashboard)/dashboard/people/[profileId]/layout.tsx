import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { profilesGet } from '@repo/handlers/requests/database/profiles';
import { ProfileGet } from '@repo/types/models/profile';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const profileId = (await params).profileId;

  const { items: profiles }: { items: ProfileGet[] } = await profilesGet();
  const profile = profiles.find((p) => p.id == profileId);

  return {
    title: profile?.first_name || 'New Profile',
  };
};

export default function LayoutProfile({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
