import { ProductVariantCreate, ProductVariantGet, ProductVariantUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'productVariants';

export const productVariantsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const productVariantsUpdate = async (
  apiUrl: string,
  productVariants: ProductVariantGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { productVariants, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const productVariantGet = (params: { apiUrl: string; productVariantId: string }) => {
  return apiCall(segment + `/${params.productVariantId}`, 'GET', params.apiUrl);
};

export const productVariantCreate = (apiUrl: string, productVariant: ProductVariantCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, productVariant);
};

export const productVariantUpdate = (apiUrl: string, productVariant: ProductVariantUpdate) => {
  return apiCall(segment + `/${productVariant.id}`, 'PUT', apiUrl, productVariant);
};

export const productVariantDelete = (apiUrl: string, productVariantId: string) => {
  return apiCall(segment + `/${productVariantId}`, 'DELETE', apiUrl);
};
