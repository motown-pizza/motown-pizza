import { ProductCreate, ProductGet, ProductUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'products';

export const productsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const productsUpdate = async (
  apiUrl: string,
  products: ProductGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { products, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const productGet = (params: { apiUrl: string; productId: string }) => {
  return apiCall(segment + `/${params.productId}`, 'GET', params.apiUrl);
};

export const productCreate = (apiUrl: string, product: ProductCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, product);
};

export const productUpdate = (apiUrl: string, product: ProductUpdate) => {
  return apiCall(segment + `/${product.id}`, 'PUT', apiUrl, product);
};

export const productDelete = (apiUrl: string, productId: string) => {
  return apiCall(segment + `/${productId}`, 'DELETE', apiUrl);
};
