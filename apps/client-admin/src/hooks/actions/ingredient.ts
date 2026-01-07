import { useStoreIngredient } from '@/libraries/zustand/stores/ingredient';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { IngredientGet } from '@repo/types/models/ingredient';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useIngredientActions = () => {
  const { session } = useStoreSession();
  const { addIngredient, updateIngredient, deleteIngredient } =
    useStoreIngredient();

  const ingredientCreate = (params: Partial<IngredientGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newIngredient: IngredientGet = {
      id: params.id || id,
      name: params.name || '',
      stock_quantity: params.stock_quantity || 0,
      unit: params.unit || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addIngredient(newIngredient);
  };

  const ingredientUpdate = (params: IngredientGet) => {
    if (!session) return;

    const now = new Date();

    const newIngredient: IngredientGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateIngredient(newIngredient);
  };

  const ingredientDelete = (params: IngredientGet) => {
    if (!session) return;

    const now = new Date();

    deleteIngredient({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { ingredientCreate, ingredientUpdate, ingredientDelete };
};
