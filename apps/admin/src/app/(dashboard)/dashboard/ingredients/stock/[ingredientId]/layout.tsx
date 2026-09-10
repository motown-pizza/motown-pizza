import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { ingredientsGet } from '@repo/handlers';
import { IngredientGet } from '@repo/types';
import { API_URL } from '@repo/constants';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const ingredientId = (await params).ingredientId;

  const { items: ingredients }: { items: IngredientGet[] } = await ingredientsGet({
    apiUrl: API_URL,
  });
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
  return <LayoutMain>{children}</LayoutMain>;
}
