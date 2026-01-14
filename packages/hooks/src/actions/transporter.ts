import { useStoreTransporter } from '@repo/libraries/zustand/stores/transporter';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { TransporterGet } from '@repo/types/models/transporter';
import {
  Status,
  SyncStatus,
  TransportVehicleType,
} from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useTransporterActions = () => {
  const { session } = useStoreSession();
  const { addTransporter, updateTransporter, deleteTransporter } =
    useStoreTransporter();

  const transporterCreate = (params: Partial<TransporterGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newTransporter: TransporterGet = {
      id: params.id || id,
      name: params.name || '',
      vehicle_id: params.vehicle_id || '',
      vehicle_type: params.vehicle_type || TransportVehicleType.MOPED,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addTransporter(newTransporter);
  };

  const transporterUpdate = (params: TransporterGet) => {
    if (!session) return;

    const now = new Date();

    const newTransporter: TransporterGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateTransporter(newTransporter);
  };

  const transporterDelete = (params: TransporterGet) => {
    if (!session) return;

    const now = new Date();

    deleteTransporter({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { transporterCreate, transporterUpdate, transporterDelete };
};
