/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ProductCreate,
  ProductRelations,
  ProductUpdate,
} from '@repo/types/models/product';

const baseRequestUrl = `${API_URL}/products`;

export const productsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get products):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const productsUpdate = async (
  products: ProductRelations[],
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
      body: JSON.stringify({ products, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update products):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const productGet = async (params: { productId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.productId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get product):', error);
    throw error;
  }
};

export const productCreate = async (product: ProductCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(product),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create product):', error);
    throw error;
  }
};

export const productUpdate = async (product: ProductUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${product.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(product),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update product):', error);
    throw error;
  }
};

export const productDelete = async (productId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${productId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete product):', error);
    throw error;
  }
};
