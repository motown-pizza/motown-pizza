import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { ingredientsGet } from '@repo/handlers/requests/database/ingredients';
import { IngredientGet } from '@repo/types/models/ingredient';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const ingredientId = (await params).ingredientId;

  const { items: ingredients }: { items: IngredientGet[] } =
    await ingredientsGet();
  const ingredient = ingredients.find((p) => p.id == ingredientId);

  return {
    title: ingredient?.name || 'New Ingredient',
  };
};

export default function LayoutIngredient({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
