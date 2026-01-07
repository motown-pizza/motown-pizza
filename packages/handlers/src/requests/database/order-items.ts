/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  OrderItemCreate,
  OrderItemGet,
  OrderItemUpdate,
} from '@repo/types/models/order-item';

const baseRequestUrl = `${API_URL}/order-items`;

export const orderItemsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get order items):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const orderItemsUpdate = async (
  orderItems: OrderItemGet[],
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
      body: JSON.stringify({ orderItems, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update order items):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const orderItemGet = async (params: { orderItemId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.orderItemId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get order item):', error);
    throw error;
  }
};

export const orderItemCreate = async (orderItem: OrderItemCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(orderItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create order item):', error);
    throw error;
  }
};

export const orderItemUpdate = async (orderItem: OrderItemUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${orderItem.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(orderItem),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update order item):', error);
    throw error;
  }
};

export const orderItemDelete = async (orderItemId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${orderItemId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete order item):', error);
    throw error;
  }
};
