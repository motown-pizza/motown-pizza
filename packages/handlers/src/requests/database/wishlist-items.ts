/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  WishlistItemCreate,
  WishlistItemRelations,
  WishlistItemUpdate,
} from '@repo/types/models/wishlist-item';

const baseRequestUrl = `${API_URL}/wishlist-items`;

export const wishlistItemsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get wishlist items):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const wishlistItemsUpdate = async (
  wishlistItems: WishlistItemRelations[],
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
      body: JSON.stringify({ wishlistItems, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update wishlist items):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const wishlistItemGet = async (params: { wishlistItemId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.wishlistItemId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get wishlist item):', error);
    throw error;
  }
};

export const wishlistItemCreate = async (wishlistItem: WishlistItemCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(wishlistItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create wishlist item):', error);
    throw error;
  }
};

export const wishlistItemUpdate = async (wishlistItem: WishlistItemUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${wishlistItem.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(wishlistItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update wishlist item):', error);
    throw error;
  }
};

export const wishlistItemDelete = async (wishlistItemId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${wishlistItemId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete wishlist item):', error);
    throw error;
  }
};
