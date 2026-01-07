/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { StoreGet } from '@repo/types/models/store';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const storeRecords = await prisma.store.findMany({
      include: {
        _count: { select: { orders: true } },
      },

      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: storeRecords },
      { status: 200, statusText: 'Stores Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get stores):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      stores,
      deletedIds,
    }: {
      stores: StoreGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.store.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = stores.map((store) =>
      prisma.store.upsert({
        where: { id: store.id },
        update: {
          ...store,
          updated_at: new Date(store.updated_at),
        },
        create: {
          ...store,
          created_at: new Date(store.created_at),
          updated_at: new Date(store.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateStores = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateStores },
      { status: 200, statusText: 'Stores Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update stores):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
