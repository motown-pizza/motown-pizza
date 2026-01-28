/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { TableGet } from '@repo/types/models/table';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;

    const tableRecord = await prisma.table.findUnique({
      where: { id: tableId },
    });

    return NextResponse.json(
      { item: tableRecord },
      { status: 200, statusText: 'Table Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tables):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;

    const table: TableGet = await request.json();

    const updateTable = await prisma.table.update({
      where: { id: tableId },
      data: table,
    });

    return NextResponse.json(
      { items: updateTable },
      { status: 200, statusText: 'Tables Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tables):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
