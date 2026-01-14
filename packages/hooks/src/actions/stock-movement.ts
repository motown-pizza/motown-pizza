import { useStoreStockMovement } from '@repo/libraries/zustand/stores/stock-movement';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { StockMovementGet } from '@repo/types/models/stock-movement';
import {
  Status,
  StockMovementType,
  SyncStatus,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useStockMovementActions = () => {
  const { session } = useStoreSession();
  const { addStockMovement, updateStockMovement, deleteStockMovement } =
    useStoreStockMovement();

  const stockMovementCreate = (params: Partial<StockMovementGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newStockMovement: StockMovementGet = {
      id: params.id || id,
      ingredient_id: params.ingredient_id || '',
      order_id: params.order_id || '',
      quantity: params.quantity || 0,
      type: params.type || StockMovementType.CONSUMPTION,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addStockMovement(newStockMovement);
  };

  const stockMovementUpdate = (params: StockMovementGet) => {
    if (!session) return;

    const now = new Date();

    const newStockMovement: StockMovementGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateStockMovement(newStockMovement);
  };

  const stockMovementDelete = (params: StockMovementGet) => {
    if (!session) return;

    const now = new Date();

    deleteStockMovement({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { stockMovementCreate, stockMovementUpdate, stockMovementDelete };
};
