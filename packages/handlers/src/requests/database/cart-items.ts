import { CartItemCreate, CartItemGet, CartItemUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'cartItems';

export const cartItemsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const cartItemsUpdate = async (
  apiUrl: string,
  cartItems: CartItemGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { cartItems, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const cartItemGet = (params: { apiUrl: string; cartItemId: string }) => {
  return apiCall(segment + `/${params.cartItemId}`, 'GET', params.apiUrl);
};

export const cartItemCreate = (apiUrl: string, cartItem: CartItemCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, cartItem);
};

export const cartItemUpdate = (apiUrl: string, cartItem: CartItemUpdate) => {
  return apiCall(segment + `/${cartItem.id}`, 'PUT', apiUrl, cartItem);
};

export const cartItemDelete = (apiUrl: string, cartItemId: string) => {
  return apiCall(segment + `/${cartItemId}`, 'DELETE', apiUrl);
};
