import { IngredientCreate, IngredientGet, IngredientUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'ingredients';

export const ingredientsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const ingredientsUpdate = async (
  apiUrl: string,
  ingredients: IngredientGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { ingredients, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const ingredientGet = (params: { apiUrl: string; ingredientId: string }) => {
  return apiCall(segment + `/${params.ingredientId}`, 'GET', params.apiUrl);
};

export const ingredientCreate = (apiUrl: string, ingredient: IngredientCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, ingredient);
};

export const ingredientUpdate = (apiUrl: string, ingredient: IngredientUpdate) => {
  return apiCall(segment + `/${ingredient.id}`, 'PUT', apiUrl, ingredient);
};

export const ingredientDelete = (apiUrl: string, ingredientId: string) => {
  return apiCall(segment + `/${ingredientId}`, 'DELETE', apiUrl);
};
