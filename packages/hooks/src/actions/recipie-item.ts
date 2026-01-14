import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import {
  MeasurementUnitType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useRecipieItemActions = () => {
  const { session } = useStoreSession();
  const { addRecipieItem, updateRecipieItem, deleteRecipieItem } =
    useStoreRecipieItem();

  const recipieItemCreate = (params: Partial<RecipieItemGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newRecipieItem: RecipieItemGet = {
      id: params.id || id,
      ingredient_id: params.ingredient_id || '',
      product_variant_id: params.product_variant_id || '',
      quantity_needed: params.quantity_needed || 0,
      unit: params.unit || MeasurementUnitType.GRAMS,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addRecipieItem(newRecipieItem);
  };

  const recipieItemUpdate = (params: RecipieItemGet) => {
    if (!session) return;

    const now = new Date();

    const newRecipieItem: RecipieItemGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateRecipieItem(newRecipieItem);
  };

  const recipieItemDelete = (params: RecipieItemGet) => {
    if (!session) return;

    const now = new Date();

    deleteRecipieItem({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { recipieItemCreate, recipieItemUpdate, recipieItemDelete };
};
