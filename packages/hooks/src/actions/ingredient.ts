import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { IngredientGet } from '@repo/types/models/ingredient';
import {
  MeasurementUnitType,
  Status,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useNotification } from '@repo/hooks/notification';
import { Variant } from '@repo/types/enums';

export const useIngredientActions = () => {
  const { session } = useStoreSession();
  const { addIngredient, updateIngredient, deleteIngredient } =
    useStoreIngredient();
  const { showNotification } = useNotification();

  const ingredientCreate = (params: Partial<IngredientGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newIngredient: IngredientGet = {
      id: params.id || id,
      name: params.name || '',
      stock_quantity: params.stock_quantity || 0,
      low_stock_margin: params.low_stock_margin || 0,
      stockout_margin: params.stockout_margin || 0,
      stock_capacity: params.stock_capacity || 0,
      unit: params.unit || MeasurementUnitType.GRAMS,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
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
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
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
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { ingredientCreate, ingredientUpdate, ingredientDelete };
};
