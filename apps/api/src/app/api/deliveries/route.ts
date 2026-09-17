/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { DeliveryGet } from '@repo/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const deliveryRecords = await db.delivery.findMany({
      where: !userId ? undefined : { profileId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { items: deliveryRecords },
      { status: 200, statusText: 'Deliveries Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get deliveries):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      deliveries,
      deletedIds,
    }: {
      deliveries: DeliveryGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await db.delivery.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = deliveries.map((delivery) =>
      db.delivery.upsert({
        where: { id: delivery.id },
        update: {
          ...delivery,
          updatedAt: new Date(delivery.updatedAt),
        },
        create: {
          ...delivery,
          createdAt: new Date(delivery.createdAt),
          updatedAt: new Date(delivery.updatedAt),
        },
      }),
    );

    // Run all operations in one transaction
    const updateDeliveries = await db.$transaction(operations);

    return NextResponse.json(
      { items: updateDeliveries },
      { status: 200, statusText: 'Deliveries Updated' },
    );
  } catch (error) {
    console.error('---> route handler error (update deliveries):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
