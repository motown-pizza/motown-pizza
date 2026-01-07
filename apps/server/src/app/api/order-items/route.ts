/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { OrderItemGet } from '@repo/types/models/order-item';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const orderItemRecords = await prisma.orderItem.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: orderItemRecords },
      { status: 200, statusText: 'Order Items Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get order items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      orderItems,
      deletedIds,
    }: { orderItems: OrderItemGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.orderItem.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = orderItems.map((orderItem) =>
      prisma.orderItem.upsert({
        where: { id: orderItem.id },
        update: {
          ...orderItem,
          updated_at: new Date(orderItem.updated_at),
        },
        create: {
          ...orderItem,
          created_at: new Date(orderItem.created_at),
          updated_at: new Date(orderItem.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateOrderItems = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateOrderItems },
      { status: 200, statusText: 'Order Items Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update order items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
