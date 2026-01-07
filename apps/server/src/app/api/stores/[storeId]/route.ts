/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    const storeRecord = await prisma.store.findUnique({
      where: { id: storeId },

      include: {
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json(
      { item: storeRecord },
      { status: 200, statusText: 'Store Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get store):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
