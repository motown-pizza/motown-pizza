import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { stockMovementsGet } from '@repo/handlers/requests/database/stock-movements';
import { ingredientsGet } from '@repo/handlers/requests/database/ingredients';
import { StockMovementGet } from '@repo/types/models/stock-movement';
import { IngredientGet } from '@repo/types/models/ingredient';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const stockMovementId = (await params).stockMovementId;

  const { items: stockMovements }: { items: StockMovementGet[] } =
    await stockMovementsGet();
  const stockMovement = stockMovements.find((p) => p.id == stockMovementId);

  const { items: ingredients }: { items: IngredientGet[] } =
    await ingredientsGet();
  const ingredient = ingredients.find(
    (i) => i.id == stockMovement?.ingredient_id
  );

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
  return <LayoutBody>{children}</LayoutBody>;
}
