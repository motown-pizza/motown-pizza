import { OrderItemCreate, OrderItemGet, OrderItemUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'order-items';

export const orderItemsGet = (params: { sourceSite?: string; apiUrl: string; userId?: string }) => {
  const query = params?.userId
    ? `?userId=${params.userId}&sourceSite=${params.sourceSite || 'not-provided'}`
    : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const orderItemsUpdate = async (
  apiUrl: string,
  orderItems: OrderItemGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { orderItems, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const orderItemGet = (params: { apiUrl: string; orderItemId: string }) => {
  return apiCall(segment + `/${params.orderItemId}`, 'GET', params.apiUrl);
};

export const orderItemCreate = (apiUrl: string, orderItem: OrderItemCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, orderItem);
};

export const orderItemUpdate = (apiUrl: string, orderItem: OrderItemUpdate) => {
  return apiCall(segment + `/${orderItem.id}`, 'PUT', apiUrl, orderItem);
};

export const orderItemDelete = (apiUrl: string, orderItemId: string) => {
  return apiCall(segment + `/${orderItemId}`, 'DELETE', apiUrl);
};
