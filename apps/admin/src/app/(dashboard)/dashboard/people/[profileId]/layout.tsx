import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { profilesGet } from '@repo/handlers';
import { ProfileGet } from '@repo/types';
import { API_URL } from '@repo/constants';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const profileId = (await params).profileId;

  const { items: profiles }: { items: ProfileGet[] } = await profilesGet({ apiUrl: API_URL });
  const profile = profiles.find((p) => p.id == profileId);

  return {
    title: profile?.firstName || 'New Profile',
  };
};

export default function LayoutProfile({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
