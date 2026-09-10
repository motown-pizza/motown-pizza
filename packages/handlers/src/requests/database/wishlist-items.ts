import { WishlistItemCreate, WishlistItemGet, WishlistItemUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'wishlist-items';

export const wishlistItemsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const wishlistItemsUpdate = async (
  apiUrl: string,
  wishlistItems: WishlistItemGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { wishlistItems, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const wishlistItemGet = (params: { apiUrl: string; wishlistItemId: string }) => {
  return apiCall(segment + `/${params.wishlistItemId}`, 'GET', params.apiUrl);
};

export const wishlistItemCreate = (apiUrl: string, wishlistItem: WishlistItemCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, wishlistItem);
};

export const wishlistItemUpdate = (apiUrl: string, wishlistItem: WishlistItemUpdate) => {
  return apiCall(segment + `/${wishlistItem.id}`, 'PUT', apiUrl, wishlistItem);
};

export const wishlistItemDelete = (apiUrl: string, wishlistItemId: string) => {
  return apiCall(segment + `/${wishlistItemId}`, 'DELETE', apiUrl);
};
