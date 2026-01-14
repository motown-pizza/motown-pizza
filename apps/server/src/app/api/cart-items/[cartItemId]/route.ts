/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> }
) {
  try {
    const { cartItemId } = await params;

    const cartItemRecord = await prisma.cartItem.findUnique({
      where: { id: cartItemId },

      include: {
        product_variant: true,
      },
    });

    return NextResponse.json(
      { item: cartItemRecord },
      { status: 200, statusText: 'Cart Item Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get cart item):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
