import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import { typeParams } from '../layout';
import PartialPageDetailsIngredient from '@/components/partial/page/details/ingredient';

export default async function Ingredient({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const ingredientId = (await params).ingredientId;

  return (
    <LayoutPage>
      <PartialPageDetailsIngredient props={{ itemId: ingredientId }} />
    </LayoutPage>
  );
}
