import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import { typeParams } from '../layout';
import PartialPageDetailsRecipieItem from '@/components/partial/page/details/recipie-item';

export default async function RecipieItem({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const recipieItem = (await params).recipieItemId;

  return (
    <LayoutPage>
      <PartialPageDetailsRecipieItem props={{ itemId: recipieItem }} />
    </LayoutPage>
  );
}
