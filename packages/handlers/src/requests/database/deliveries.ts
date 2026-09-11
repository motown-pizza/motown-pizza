import { DeliveryCreate, DeliveryGet, DeliveryUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'deliveries';

export const deliveriesGet = (params: { sourceSite?: string; apiUrl: string; userId?: string }) => {
  const query = params?.userId
    ? `?userId=${params.userId}&sourceSite=${params.sourceSite || 'not-provided'}`
    : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const deliveriesUpdate = async (
  apiUrl: string,
  deliveries: DeliveryGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { deliveries, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const deliveryGet = (params: { apiUrl: string; deliveryId: string }) => {
  return apiCall(segment + `/${params.deliveryId}`, 'GET', params.apiUrl);
};

export const deliveryCreate = (apiUrl: string, delivery: DeliveryCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, delivery);
};

export const deliveryUpdate = (apiUrl: string, delivery: DeliveryUpdate) => {
  return apiCall(segment + `/${delivery.id}`, 'PUT', apiUrl, delivery);
};

export const deliveryDelete = (apiUrl: string, deliveryId: string) => {
  return apiCall(segment + `/${deliveryId}`, 'DELETE', apiUrl);
};
