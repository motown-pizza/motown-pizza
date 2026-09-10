import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { stockMovementsGet } from '@repo/handlers';
import { ingredientsGet } from '@repo/handlers';
import { StockMovementGet } from '@repo/types';
import { IngredientGet } from '@repo/types';
import { API_URL } from '@repo/constants';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const stockMovementId = (await params).stockMovementId;

  const { items: stockMovements }: { items: StockMovementGet[] } = await stockMovementsGet({
    apiUrl: API_URL,
  });
  const stockMovement = stockMovements.find((p) => p.id == stockMovementId);

  const { items: ingredients }: { items: IngredientGet[] } = await ingredientsGet({
    apiUrl: API_URL,
  });
  const ingredient = ingredients.find((i) => i.id == stockMovement?.ingredientId);

  return {
    title: `${ingredient?.name || 'New'} Stock Change`,
  };
};

export default function LayoutStockMovement({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
