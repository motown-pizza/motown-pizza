import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { recipieItemsGet } from '@repo/handlers/requests/database/recipie-items';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { ingredientsGet } from '@repo/handlers/requests/database/ingredients';
import { IngredientGet } from '@repo/types/models/ingredient';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const recipieItemId = (await params).recipieItemId;

  const { items: recipieItems }: { items: RecipieItemGet[] } =
    await recipieItemsGet();
  const { items: ingredients }: { items: IngredientGet[] } =
    await ingredientsGet();
  const recipieItem = recipieItems.find((i) => i.id == recipieItemId);
  const ingredient = ingredients.find(
    (i) => i.id == recipieItem?.ingredient_id
  );

  return {
    title: ingredient?.name || 'New Recipie Item',
  };
};

export default function LayoutRecipieItem({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
