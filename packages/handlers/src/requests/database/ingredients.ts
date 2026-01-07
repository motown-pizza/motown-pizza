/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  IngredientCreate,
  IngredientRelations,
  IngredientUpdate,
} from '@repo/types/models/ingredient';

const baseRequestUrl = `${API_URL}/ingredients`;

export const ingredientsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get ingredients):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const ingredientsUpdate = async (
  ingredients: IngredientRelations[],
  deletedIds?: string[]
) => {
  // Cancel previous request if still in-flight
  if (currentController) currentController.abort();

  // New controller for this request
  currentController = new AbortController();

  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ ingredients, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update ingredients):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const ingredientGet = async (params: { ingredientId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.ingredientId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get ingredient):', error);
    throw error;
  }
};

export const ingredientCreate = async (ingredient: IngredientCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(ingredient),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create ingredient):', error);
    throw error;
  }
};

export const ingredientUpdate = async (ingredient: IngredientUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${ingredient.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(ingredient),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update ingredient):', error);
    throw error;
  }
};

export const ingredientDelete = async (ingredientId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${ingredientId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete ingredient):', error);
    throw error;
  }
};
