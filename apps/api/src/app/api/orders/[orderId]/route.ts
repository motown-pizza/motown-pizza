/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;

    const orderRecord = await db.order.findUnique({
      where: { id: orderId },

      include: {
        _count: { select: { orderItems: true } },
      },
    });

    return NextResponse.json({ item: orderRecord }, { status: 200, statusText: 'Order Retrieved' });
  } catch (error) {
    console.error('---> route handler error (get order):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
