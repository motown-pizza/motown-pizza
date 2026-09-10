import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { recipieItemsGet } from '@repo/handlers';
import { RecipieItemGet } from '@repo/types';
import { ingredientsGet } from '@repo/handlers';
import { IngredientGet } from '@repo/types';
import { API_URL } from '@repo/constants';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const recipieItemId = (await params).recipieItemId;

  const { items: recipieItems }: { items: RecipieItemGet[] } = await recipieItemsGet({
    apiUrl: API_URL,
  });
  const { items: ingredients }: { items: IngredientGet[] } = await ingredientsGet({
    apiUrl: API_URL,
  });
  const recipieItem = recipieItems.find((i) => i.id == recipieItemId);
  const ingredient = ingredients.find((i) => i.id == recipieItem?.ingredientId);

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
  return <LayoutMain>{children}</LayoutMain>;
}
