'use client';

import React from 'react';
import { useAppshellInitialize, useLoadAppData, useSessionStore } from '@repo/store';
import { UserObject } from '@repo/types';
import { AppShellValue } from '@repo/store';
import { STORE_NAME } from '@repo/constants';

export function ProviderInitialize({
  props,
  children,
}: {
  props: {
    baseUrl: string;
    sessionUser: UserObject | null;
    cookie?: AppShellValue;
  };
  children: React.ReactNode;
}) {
  // initialize stores

  useSessionStore({
    sessionUser: props?.sessionUser || null,
    options: { clientOnly: false },
  });

  // useUserRoleStore();

  useAppshellInitialize();

  useLoadAppData({
    sourceSite: '',
    apiUrl: props.baseUrl,
    clientOnly: false,
    storesToLoad: STORES_TO_LOAD,
  });

  return <div>{children}</div>;
}

const STORES_TO_LOAD = {
  [STORE_NAME.CART_ITEMS]: true,
  [STORE_NAME.CATEGORIES]: true,
  [STORE_NAME.DELIVERIES]: true,
  [STORE_NAME.INGREDIENTS]: true,
  [STORE_NAME.ORDER_ITEMS]: true,
  [STORE_NAME.ORDERS]: true,
  [STORE_NAME.POSTS]: true,
  [STORE_NAME.PRODUCT_VARIANTS]: true,
  [STORE_NAME.PRODUCTS]: true,
  [STORE_NAME.PROFILES]: true,
  [STORE_NAME.RECIPIE_ITEMS]: true,
  [STORE_NAME.STOCK_MOVEMENTS]: true,
  [STORE_NAME.TABLE_BOOKINGS]: true,
  [STORE_NAME.TABLES]: true,
  [STORE_NAME.WISHLIST_ITEMS]: true,
};
