/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  DeliveryCreate,
  DeliveryRelations,
  DeliveryUpdate,
} from '@repo/types/models/delivery';

const baseRequestUrl = `${API_URL}/deliveries`;

export const deliveriesGet = async (options?: { profileId?: string }) => {
  try {
    const request = new Request(
      baseRequestUrl +
        `${!options?.profileId ? '' : `?profileId=${options.profileId}`}`,
      {
        method: 'GET',
        headers: HEADERS.WITHOUT_BODY,
      }
    );

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get deliveries):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const deliveriesUpdate = async (
  deliveries: DeliveryRelations[],
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
      body: JSON.stringify({ deliveries, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update deliveries):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const deliveryGet = async (params: { deliveryId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.deliveryId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get delivery):', error);
    throw error;
  }
};

export const deliveryCreate = async (delivery: DeliveryCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(delivery),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create delivery):', error);
    throw error;
  }
};

export const deliveryUpdate = async (delivery: DeliveryUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${delivery.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(delivery),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update delivery):', error);
    throw error;
  }
};

export const deliveryDelete = async (deliveryId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${deliveryId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete delivery):', error);
    throw error;
  }
};
