import { RecipieItemCreate, RecipieItemGet, RecipieItemUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'recipie-items';

export const recipieItemsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const recipieItemsUpdate = async (
  apiUrl: string,
  recipieItems: RecipieItemGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { recipieItems, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const recipieItemGet = (params: { apiUrl: string; recipieItemId: string }) => {
  return apiCall(segment + `/${params.recipieItemId}`, 'GET', params.apiUrl);
};

export const recipieItemCreate = (apiUrl: string, recipieItem: RecipieItemCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, recipieItem);
};

export const recipieItemUpdate = (apiUrl: string, recipieItem: RecipieItemUpdate) => {
  return apiCall(segment + `/${recipieItem.id}`, 'PUT', apiUrl, recipieItem);
};

export const recipieItemDelete = (apiUrl: string, recipieItemId: string) => {
  return apiCall(segment + `/${recipieItemId}`, 'DELETE', apiUrl);
};
