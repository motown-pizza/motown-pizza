'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { useSessionStore, useLoadStores } from '@repo/hooks/store';
import ProviderSync from './sync';
import { User } from '@supabase/supabase-js';

export default function Store({
  props,
  children,
}: {
  props?: { sessionUser: User | null };
  children: React.ReactNode;
}) {
  // initialize stores

  useSessionStore({
    sessionUser: props?.sessionUser || null,
    options: { clientOnly: false },
  });
  useLoadStores({
    options: {
      clientOnly: false,
      storesToLoad: {
        products: true,
        productVariants: true,
        ingredients: true,
        recipieItems: true,
        cartItems: true,
        orders: true,
        orderItems: true,
        deliveries: true,
      },
    },
  });

  return (
    <div>
      <ProviderSync>{children}</ProviderSync>
    </div>
  );
}
