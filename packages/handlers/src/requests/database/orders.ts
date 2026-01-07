/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  OrderCreate,
  OrderRelations,
  OrderUpdate,
} from '@repo/types/models/order';

const baseRequestUrl = `${API_URL}/orders`;

export const ordersGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get orders):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const ordersUpdate = async (
  orders: OrderRelations[],
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
      body: JSON.stringify({ orders, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update orders):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const orderGet = async (params: { orderId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.orderId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get order):', error);
    throw error;
  }
};

export const orderCreate = async (order: OrderCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(order),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create order):', error);
    throw error;
  }
};

export const orderUpdate = async (order: OrderUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${order.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(order),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update order):', error);
    throw error;
  }
};

export const orderDelete = async (orderId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${orderId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete order):', error);
    throw error;
  }
};
