/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  StockMovementCreate,
  StockMovementGet,
  StockMovementUpdate,
} from '@repo/types/models/stock-movement';

const baseRequestUrl = `${API_URL}/stock-movements`;

export const stockMovementsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get stock movements):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const stockMovementsUpdate = async (
  stockMovements: StockMovementGet[],
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
      body: JSON.stringify({ stockMovements, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update stock movements):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const stockMovementGet = async (params: { stockMovementId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.stockMovementId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get stock movement):', error);
    throw error;
  }
};

export const stockMovementCreate = async (
  stockMovement: StockMovementCreate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(stockMovement),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create stock movement):', error);
    throw error;
  }
};

export const stockMovementUpdate = async (
  stockMovement: StockMovementUpdate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/${stockMovement.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(stockMovement),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update stock movement):', error);
    throw error;
  }
};

export const stockMovementDelete = async (stockMovementId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${stockMovementId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete stock movement):', error);
    throw error;
  }
};
