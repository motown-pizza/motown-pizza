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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      console.log('---> route handler info (get tables):', {
        info: 'profile id not provided',
      });
    }

    const tableRecords = await prisma.table.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: tableRecords },
      { status: 200, statusText: 'Tables Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tables):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      tables,
      deletedIds,
    }: { tables: TableGet[]; deletedIds?: string[] } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.table.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = tables.map((table) =>
      prisma.table.upsert({
        where: { id: table.id },
        update: {
          ...table,
          updated_at: new Date(table.updated_at),
        },
        create: {
          ...table,
          created_at: new Date(table.created_at),
          updated_at: new Date(table.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateTables = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateTables },
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
