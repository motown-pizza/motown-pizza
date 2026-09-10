import { StockMovementCreate, StockMovementGet, StockMovementUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'stock-movements';

export const stockMovementsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const stockMovementsUpdate = async (
  apiUrl: string,
  stockMovements: StockMovementGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { stockMovements, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const stockMovementGet = (params: { apiUrl: string; stockMovementId: string }) => {
  return apiCall(segment + `/${params.stockMovementId}`, 'GET', params.apiUrl);
};

export const stockMovementCreate = (apiUrl: string, stockMovement: StockMovementCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, stockMovement);
};

export const stockMovementUpdate = (apiUrl: string, stockMovement: StockMovementUpdate) => {
  return apiCall(segment + `/${stockMovement.id}`, 'PUT', apiUrl, stockMovement);
};

export const stockMovementDelete = (apiUrl: string, stockMovementId: string) => {
  return apiCall(segment + `/${stockMovementId}`, 'DELETE', apiUrl);
};
