'use client';

import { useStoreIngredient } from '../ingredient';
import { useStoreSession } from '../session';
import { IngredientGet } from '@repo/types';
import { MeasurementUnitType, Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useNotification } from '@repo/notifications';
import { Variant } from '@repo/types';

export const useIngredientActions = () => {
  const { session } = useStoreSession();
  const { addIngredient, updateIngredient, deleteIngredient } = useStoreIngredient();
  const { showNotification } = useNotification();

  const ingredientCreate = (params: Partial<IngredientGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newIngredient: IngredientGet = {
      id: params.id || id,
      name: params.name || '',
      stockQuantity: params.stockQuantity || 0,
      lowStockMargin: params.lowStockMargin || 0,
      stockoutMargin: params.stockoutMargin || 0,
      stockCapacity: params.stockCapacity || 0,
      unit: params.unit || MeasurementUnitType.GRAMS,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addIngredient(newIngredient);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Ingredient Added',
      desc: `'${newIngredient.name}' has been added`,
    });
  };

  const ingredientUpdate = (params: IngredientGet) => {
    if (!session) return;

    const now = new Date();

    const newIngredient: IngredientGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateIngredient(newIngredient);

    showNotification({
      variant: Variant.SUCCESS,
      title: 'Ingredient Updated',
      desc: `'${newIngredient.name}' has been updated`,
    });
  };

  const ingredientDelete = (params: IngredientGet) => {
    if (!session) return;

    const now = new Date();

    deleteIngredient({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { ingredientCreate, ingredientUpdate, ingredientDelete };
};
