/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { CartItemGet } from '@repo/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const cartItemRecords = await db.cartItem.findMany({
      where: !userId ? undefined : { profileId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { items: cartItemRecords },
      { status: 200, statusText: 'Cart Items Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get cart items):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      cartItems,
      deletedIds,
    }: {
      cartItems: CartItemGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await db.cartItem.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = cartItems.map((cartItem) =>
      db.cartItem.upsert({
        where: { id: cartItem.id },
        update: {
          ...cartItem,
          updatedAt: new Date(cartItem.updatedAt),
        },
        create: {
          ...cartItem,
          createdAt: new Date(cartItem.createdAt),
          updatedAt: new Date(cartItem.updatedAt),
        },
      }),
    );

    // Run all operations in one transaction
    const updateCartItems = await db.$transaction(operations);

    return NextResponse.json(
      { items: updateCartItems },
      { status: 200, statusText: 'Cart Items Updated' },
    );
  } catch (error) {
    console.error('---> route handler error (update cart items):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
