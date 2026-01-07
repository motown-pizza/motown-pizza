/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  StoreCreate,
  StoreRelations,
  StoreUpdate,
} from '@repo/types/models/store';

const baseRequestUrl = `${API_URL}/stores`;

export const storesGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get stores):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const storesUpdate = async (
  stores: StoreRelations[],
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
      body: JSON.stringify({ stores, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update stores):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const storeGet = async (params: { storeId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.storeId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get store):', error);
    throw error;
  }
};

export const storeCreate = async (store: StoreCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(store),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create store):', error);
    throw error;
  }
};

export const storeUpdate = async (store: StoreUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${store.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(store),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update store):', error);
    throw error;
  }
};

export const storeDelete = async (storeId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${storeId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete store):', error);
    throw error;
  }
};
