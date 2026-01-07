/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  TransporterCreate,
  TransporterRelations,
  TransporterUpdate,
} from '@repo/types/models/transporter';

const baseRequestUrl = `${API_URL}/transporters`;

export const transportersGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get transporters):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const transportersUpdate = async (
  transporters: TransporterRelations[],
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
      body: JSON.stringify({ transporters, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update transporters):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const transporterGet = async (params: { transporterId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.transporterId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get transporter):', error);
    throw error;
  }
};

export const transporterCreate = async (transporter: TransporterCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(transporter),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create transporter):', error);
    throw error;
  }
};

export const transporterUpdate = async (transporter: TransporterUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${transporter.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(transporter),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update transporter):', error);
    throw error;
  }
};

export const transporterDelete = async (transporterId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${transporterId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete transporter):', error);
    throw error;
  }
};
