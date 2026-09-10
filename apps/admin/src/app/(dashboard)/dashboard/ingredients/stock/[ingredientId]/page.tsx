import React from 'react';
import { typeParams } from '../layout';
import PartialPageDetailsIngredient from '@admin/ui/partial/page/details/ingredient';

export default async function Ingredient({ params }: { params: Promise<typeParams> }) {
  const ingredientId = (await params).ingredientId;

  return (
    <div>
      <PartialPageDetailsIngredient props={{ itemId: ingredientId }} />
    </div>
  );
}
