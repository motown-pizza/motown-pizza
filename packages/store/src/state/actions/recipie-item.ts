'use client';

import { useStoreRecipieItem } from '../recipie-item';
import { useStoreSession } from '../session';
import { RecipieItemGet } from '@repo/types';
import { MeasurementUnitType, Status, SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';

export const useRecipieItemActions = () => {
  const { session } = useStoreSession();
  const { addRecipieItem, updateRecipieItem, deleteRecipieItem } = useStoreRecipieItem();

  const recipieItemCreate = (params: Partial<RecipieItemGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newRecipieItem: RecipieItemGet = {
      id: params.id || id,
      ingredientId: params.ingredientId || '',
      productVariantId: params.productVariantId || '',
      quantityNeeded: params.quantityNeeded || 0,
      unit: params.unit || MeasurementUnitType.GRAMS,
      status: params.status || Status.ACTIVE,
      syncStatus: SyncStatus.PENDING,
      createdAt: now.toISOString() as any,
      updatedAt: now.toISOString() as any,
    };

    addRecipieItem(newRecipieItem);
  };

  const recipieItemUpdate = (params: RecipieItemGet) => {
    if (!session) return;

    const now = new Date();

    const newRecipieItem: RecipieItemGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: now.toISOString() as any,
    };

    updateRecipieItem(newRecipieItem);
  };

  const recipieItemDelete = (params: RecipieItemGet) => {
    if (!session) return;

    const now = new Date();

    deleteRecipieItem({
      ...params,
      syncStatus: SyncStatus.DELETED,
      updatedAt: now.toISOString() as any,
    });
  };

  return { recipieItemCreate, recipieItemUpdate, recipieItemDelete };
};
