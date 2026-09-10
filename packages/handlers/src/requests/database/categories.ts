import { CategoryCreate, CategoryGet, CategoryUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'categories';

export const categoriesGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const categoriesUpdate = async (
  apiUrl: string,
  categories: CategoryGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { categories, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const categoryGet = (params: { apiUrl: string; categoryId: string }) => {
  return apiCall(segment + `/${params.categoryId}`, 'GET', params.apiUrl);
};

export const categoryCreate = (apiUrl: string, category: CategoryCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, category);
};

export const categoryUpdate = (apiUrl: string, category: CategoryUpdate) => {
  return apiCall(segment + `/${category.id}`, 'PUT', apiUrl, category);
};

export const categoryDelete = (apiUrl: string, categoryId: string) => {
  return apiCall(segment + `/${categoryId}`, 'DELETE', apiUrl);
};
