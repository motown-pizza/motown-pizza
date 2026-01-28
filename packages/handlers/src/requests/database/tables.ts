/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  TableCreate,
  TableRelations,
  TableUpdate,
} from '@repo/types/models/table';

const baseRequestUrl = `${API_URL}/tables`;

export const tablesGet = async (options?: { profileId?: string }) => {
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
    console.error('---> handler error - (get tables):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const tablesUpdate = async (
  tables: TableRelations[],
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
      body: JSON.stringify({ tables, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update tables):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const tableGet = async (params: { tableId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.tableId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get table):', error);
    throw error;
  }
};

export const tableCreate = async (table: TableCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(table),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create table):', error);
    throw error;
  }
};

export const tableUpdate = async (table: TableUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${table.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(table),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update table):', error);
    throw error;
  }
};

export const tableDelete = async (tableId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${tableId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete table):', error);
    throw error;
  }
};
