import { OrderCreate, OrderGet, OrderUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'orders';

export const ordersGet = (params: { sourceSite?: string; apiUrl: string; userId?: string }) => {
  const query = params?.userId
    ? `?userId=${params.userId}&sourceSite=${params.sourceSite || 'not-provided'}`
    : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const ordersUpdate = async (apiUrl: string, orders: OrderGet[], deletedIds?: string[]) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { orders, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const orderGet = (params: { apiUrl: string; orderId: string }) => {
  return apiCall(segment + `/${params.orderId}`, 'GET', params.apiUrl);
};

export const orderCreate = (apiUrl: string, order: OrderCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, order);
};

export const orderUpdate = (apiUrl: string, order: OrderUpdate) => {
  return apiCall(segment + `/${order.id}`, 'PUT', apiUrl, order);
};

export const orderDelete = (apiUrl: string, orderId: string) => {
  return apiCall(segment + `/${orderId}`, 'DELETE', apiUrl);
};
