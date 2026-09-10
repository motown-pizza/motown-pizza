import React from 'react';
import { typeParams } from '../layout';
import PartialPageDetailsRecipieItem from '@admin/ui/partial/page/details/recipie-item';

export default async function RecipieItem({ params }: { params: Promise<typeParams> }) {
  const recipieItem = (await params).recipieItemId;

  return (
    <div>
      <PartialPageDetailsRecipieItem props={{ itemId: recipieItem }} />
    </div>
  );
}
