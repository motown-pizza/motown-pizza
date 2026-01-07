/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { StockMovementGet } from '@repo/types/models/stock-movement';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const stockMovementRecords = await prisma.stockMovement.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: stockMovementRecords },
      { status: 200, statusText: 'Stock Movements Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get stock movements):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      stockMovements,
      deletedIds,
    }: { stockMovements: StockMovementGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.stockMovement.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = stockMovements.map((stockMovement) =>
      prisma.stockMovement.upsert({
        where: { id: stockMovement.id },
        update: {
          ...stockMovement,
          updated_at: new Date(stockMovement.updated_at),
        },
        create: {
          ...stockMovement,
          created_at: new Date(stockMovement.created_at),
          updated_at: new Date(stockMovement.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateStockMovements = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateStockMovements },
      { status: 200, statusText: 'Stock Movements Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update stock movements):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
