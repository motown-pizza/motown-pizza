/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { APP_NAME } from '@/data/constants';
import { STORE_NAME } from '@repo/constants/names';
import { INDEXEDDB_VERSION } from '@repo/constants/sizes';
import { DBConfig } from '@repo/types/indexed-db';
import { linkify } from '@repo/utilities/url';

export const config: DBConfig = {
  name: linkify(APP_NAME),
  version: INDEXEDDB_VERSION,
  stores: [
    {
      name: STORE_NAME.SETTINGS,
      keyPath: 'id',
    },
    // {
    //   name: STORE_NAME.PROFILES,
    //   keyPath: 'id',
    // },
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
    // {
    //   name: STORE_NAME.STOCK_MOVEMENTS,
    //   keyPath: 'id',
    // },
    {
      name: STORE_NAME.DELIVERIES,
      keyPath: 'id',
    },
  ],
};
