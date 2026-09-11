'use client';

import { useStoreStockMovement } from '../stock-movement';
import { useStoreSession } from '../session';
import { StockMovementGet } from '@repo/types';
import { Status, StockMovementType, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useIngredientActions } from './ingredient';
import { useStoreIngredient } from '../ingredient';
import { IngredientGet } from '@repo/types';

export const useStockMovementActions = () => {
  const { session } = useStoreSession();
  const { addStockMovement, updateStockMovement, deleteStockMovement } = useStoreStockMovement();

  const { ingredients } = useStoreIngredient();
  const { ingredientUpdate } = useIngredientActions();

  const stockMovementCreate = (params: Partial<StockMovementGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newStockMovement: StockMovementGet = {
      id: params.id || id,
      ingredientId: params.ingredientId || '',
      orderId: params.orderId || null,
      quantity: params.quantity || 0,
      type: params.type || StockMovementType.CONSUMPTION,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addStockMovement(newStockMovement);
  };

  const stockMovementUpdate = (params: StockMovementGet) => {
    if (!session) return;

    const now = new Date();

    const newStockMovement: StockMovementGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateStockMovement(newStockMovement);
  };

  const stockMovementDelete = (params: StockMovementGet) => {
    if (!session) return;

    const now = new Date();

    const ingredient = ingredients?.find((i) => i.id === params.ingredientId);

    if (!ingredient) return;

    const updatedIngredient: IngredientGet = {
      ...ingredient,
      stockQuantity:
        params.type == StockMovementType.CONSUMPTION
          ? ingredient.stockQuantity + params.quantity
          : params.type === StockMovementType.PURCHASE
            ? ingredient.stockQuantity - params.quantity
            : ingredient.stockQuantity,
    };

    ingredientUpdate(updatedIngredient);

    deleteStockMovement({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { stockMovementCreate, stockMovementUpdate, stockMovementDelete };
};
