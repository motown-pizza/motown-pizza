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
  { params }: { params: Promise<{ orderItemId: string }> },
) {
  try {
    const { orderItemId } = await params;

    const orderItemRecord = await db.orderItem.findUnique({
      where: { id: orderItemId },
    });

    return NextResponse.json(
      { item: orderItemRecord },
      { status: 200, statusText: 'Order Item Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get order item):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
