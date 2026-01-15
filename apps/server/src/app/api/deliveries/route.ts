/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { DeliveryGet } from '@repo/types/models/delivery';
import { OrderGet } from '@repo/types/models/order';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    let orderRecords: OrderGet[] = [];

    if (profileId) {
      orderRecords = await prisma.order.findMany({
        where: { profile_id: profileId },
      });
    }

    const deliveryRecords = await prisma.delivery.findMany({
      where: {
        order_id: {
          in: orderRecords.map((order) => order.id),
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: deliveryRecords },
      { status: 200, statusText: 'Deliveries Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get deliveries):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      await prisma.delivery.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = deliveries.map((delivery) =>
      prisma.delivery.upsert({
        where: { id: delivery.id },
        update: {
          ...delivery,
          updated_at: new Date(delivery.updated_at),
        },
        create: {
          ...delivery,
          created_at: new Date(delivery.created_at),
          updated_at: new Date(delivery.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateDeliveries = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateDeliveries },
      { status: 200, statusText: 'Deliveries Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update deliveries):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
