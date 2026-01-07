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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stockMovementId: string }> }
) {
  try {
    const { stockMovementId } = await params;

    const stockMovementRecord = await prisma.stockMovement.findUnique({
      where: { id: stockMovementId },
    });

    return NextResponse.json(
      { item: stockMovementRecord },
      { status: 200, statusText: 'Stock Movement Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get stock movements):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ stockMovementId: string }> }
) {
  try {
    const { stockMovementId } = await params;

    const stockMovement: StockMovementGet = await request.json();

    const updateStockMovement = await prisma.stockMovement.update({
      where: { id: stockMovementId },
      data: stockMovement,
    });

    return NextResponse.json(
      { items: updateStockMovement },
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
