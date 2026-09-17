/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { OrderGet } from '@repo/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const orderRecords = await db.order.findMany({
      where: !userId ? undefined : { profileId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { items: orderRecords },
      { status: 200, statusText: 'Orders Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get orders):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      orders,
      deletedIds,
    }: {
      orders: OrderGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await db.order.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = orders.map((order) =>
      db.order.upsert({
        where: { id: order.id },
        update: {
          ...order,
          updatedAt: new Date(order.updatedAt),
        },
        create: {
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        },
      }),
    );

    // Run all operations in one transaction
    const updateOrders = await db.$transaction(operations);

    return NextResponse.json(
      { items: updateOrders },
      { status: 200, statusText: 'Orders Updated' },
    );
  } catch (error) {
    console.error('---> route handler error (update orders):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
