/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  TableBookingCreate,
  TableBookingRelations,
  TableBookingUpdate,
} from '@repo/types/models/table-booking';

const baseRequestUrl = `${API_URL}/table-bookings`;

export const tableBookingsGet = async (options?: { profileId?: string }) => {
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
    console.error('---> handler error - (get tableBookings):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const tableBookingsUpdate = async (
  tableBookings: TableBookingRelations[],
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
      body: JSON.stringify({ tableBookings, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update tableBookings):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const tableBookingGet = async (params: { tableBookingId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.tableBookingId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get tableBooking):', error);
    throw error;
  }
};

export const tableBookingCreate = async (tableBooking: TableBookingCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(tableBooking),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create tableBooking):', error);
    throw error;
  }
};

export const tableBookingUpdate = async (tableBooking: TableBookingUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${tableBooking.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(tableBooking),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update tableBooking):', error);
    throw error;
  }
};

export const tableBookingDelete = async (tableBookingId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${tableBookingId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete tableBooking):', error);
    throw error;
  }
};
