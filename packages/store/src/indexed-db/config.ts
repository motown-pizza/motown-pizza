import { COMPANY_NAME } from '@repo/constants';
import { STORE_NAME } from '@repo/constants';
import { DBConfig } from '@repo/types';
import { linkify } from '@repo/utils';

export const config: DBConfig = {
  name: linkify(COMPANY_NAME),
  version: 2,
  stores: [
    {
      name: STORE_NAME.SETTINGS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.PROFILES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.POSTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.CATEGORIES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.PRODUCTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.CART_ITEMS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.WISHLIST_ITEMS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.PRODUCT_VARIANTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.INGREDIENTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.RECIPIE_ITEMS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.ORDERS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.ORDER_ITEMS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.TABLES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.TABLE_BOOKINGS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.STOCK_MOVEMENTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.DELIVERIES,
      keyPath: 'id',
    },
  ],
};
