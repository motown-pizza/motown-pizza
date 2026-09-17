/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { OrderItemGet } from '@repo/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const orderItemRecords = await db.orderItem.findMany({
      where: !userId ? undefined : { profileId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { items: orderItemRecords },
      { status: 200, statusText: 'Order Items Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get order items):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      orderItems,
      deletedIds,
    }: {
      orderItems: OrderItemGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await db.orderItem.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = orderItems.map((orderItem) =>
      db.orderItem.upsert({
        where: { id: orderItem.id },
        update: {
          ...orderItem,
          updatedAt: new Date(orderItem.updatedAt),
        },
        create: {
          ...orderItem,
          createdAt: new Date(orderItem.createdAt),
          updatedAt: new Date(orderItem.updatedAt),
        },
      }),
    );

    // Run all operations in one transaction
    const updateOrderItems = await db.$transaction(operations);

    return NextResponse.json(
      { items: updateOrderItems },
      { status: 200, statusText: 'Order Items Updated' },
    );
  } catch (error) {
    console.error('---> route handler error (update order items):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
