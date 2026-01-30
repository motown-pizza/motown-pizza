/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { OrderGet } from '@repo/types/models/order';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      console.log('---> route handler info (get orders):', {
        info: 'profile id not provided',
      });
    }

    const orderRecords = await prisma.order.findMany({
      where: !profileId ? undefined : { profile_id: profileId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: orderRecords },
      { status: 200, statusText: 'Orders Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get orders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      orders,
      deletedIds,
    }: { orders: OrderGet[]; deletedIds?: string[] } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.order.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = orders.map((order) =>
      prisma.order.upsert({
        where: { id: order.id },
        update: {
          ...order,
          updated_at: new Date(order.updated_at),
        },
        create: {
          ...order,
          created_at: new Date(order.created_at),
          updated_at: new Date(order.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateOrders = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateOrders },
      { status: 200, statusText: 'Orders Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update orders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
