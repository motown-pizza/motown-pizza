/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { CartItemGet } from '@repo/types/models/cart-item';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      console.log('---> route handler info (get cart items):', {
        info: 'profile id not provided',
      });
    }

    const cartItemRecords = await prisma.cartItem.findMany({
      where: {
        profile_id: profileId || undefined,
      },

      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: cartItemRecords },
      { status: 200, statusText: 'CartItems Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get cartItems):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      await prisma.cartItem.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = cartItems.map((cartItem) =>
      prisma.cartItem.upsert({
        where: { id: cartItem.id },
        update: {
          ...cartItem,
          updated_at: new Date(cartItem.updated_at),
        },
        create: {
          ...cartItem,
          created_at: new Date(cartItem.created_at),
          updated_at: new Date(cartItem.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateCartItems = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateCartItems },
      { status: 200, statusText: 'CartItems Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update cartItems):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
