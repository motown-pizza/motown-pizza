/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  CartItemCreate,
  CartItemRelations,
  CartItemUpdate,
} from '@repo/types/models/cart-item';

const baseRequestUrl = `${API_URL}/cart-items`;

export const cartItemsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get cart items):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const cartItemsUpdate = async (
  cartItems: CartItemRelations[],
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
      body: JSON.stringify({ cartItems, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update cart items):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const cartItemGet = async (params: { cartItemId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.cartItemId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get cart item):', error);
    throw error;
  }
};

export const cartItemCreate = async (cartItem: CartItemCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(cartItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create cart item):', error);
    throw error;
  }
};

export const cartItemUpdate = async (cartItem: CartItemUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${cartItem.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(cartItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update cart item):', error);
    throw error;
  }
};

export const cartItemDelete = async (cartItemId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${cartItemId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete cart item):', error);
    throw error;
  }
};
