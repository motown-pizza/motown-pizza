/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ProductVariantCreate,
  ProductVariantRelations,
  ProductVariantUpdate,
} from '@repo/types/models/product-variant';

const baseRequestUrl = `${API_URL}/product-variants`;

export const productVariantsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get product variants):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const productVariantsUpdate = async (
  productVariants: ProductVariantRelations[],
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
      body: JSON.stringify({ productVariants, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update product variants):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const productVariantGet = async (params: {
  productVariantId: string;
}) => {
  try {
    const request = new Request(
      `${baseRequestUrl}/${params.productVariantId}`,
      {
        method: 'GET',
        headers: HEADERS.WITHOUT_BODY,
      }
    );

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get product variant):', error);
    throw error;
  }
};

export const productVariantCreate = async (
  productVariant: ProductVariantCreate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(productVariant),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create product variant):', error);
    throw error;
  }
};

export const productVariantUpdate = async (
  productVariant: ProductVariantUpdate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/${productVariant.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(productVariant),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update product variant):', error);
    throw error;
  }
};

export const productVariantDelete = async (productVariantId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${productVariantId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete product variant):', error);
    throw error;
  }
};
