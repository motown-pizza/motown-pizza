import { TableBookingCreate, TableBookingGet, TableBookingUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'table-bookings';

export const tableBookingsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const tableBookingsUpdate = async (
  apiUrl: string,
  tableBookings: TableBookingGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { tableBookings, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const tableBookingGet = (params: { apiUrl: string; tableBookingId: string }) => {
  return apiCall(segment + `/${params.tableBookingId}`, 'GET', params.apiUrl);
};

export const tableBookingCreate = (apiUrl: string, tableBooking: TableBookingCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, tableBooking);
};

export const tableBookingUpdate = (apiUrl: string, tableBooking: TableBookingUpdate) => {
  return apiCall(segment + `/${tableBooking.id}`, 'PUT', apiUrl, tableBooking);
};

export const tableBookingDelete = (apiUrl: string, tableBookingId: string) => {
  return apiCall(segment + `/${tableBookingId}`, 'DELETE', apiUrl);
};
