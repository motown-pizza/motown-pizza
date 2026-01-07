/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  RecipieItemCreate,
  RecipieItemGet,
  RecipieItemUpdate,
} from '@repo/types/models/recipie-item';

const baseRequestUrl = `${API_URL}/recipie-items`;

export const recipieItemsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get recipie items):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const recipieItemsUpdate = async (
  recipieItems: RecipieItemGet[],
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
      body: JSON.stringify({ recipieItems, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update recipie items):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const recipieItemGet = async (params: { recipieItemId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.recipieItemId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get recipie item):', error);
    throw error;
  }
};

export const recipieItemCreate = async (recipieItem: RecipieItemCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(recipieItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create recipie item):', error);
    throw error;
  }
};

export const recipieItemUpdate = async (recipieItem: RecipieItemUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${recipieItem.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(recipieItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update recipie item):', error);
    throw error;
  }
};

export const recipieItemDelete = async (recipieItemId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${recipieItemId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete recipie item):', error);
    throw error;
  }
};
