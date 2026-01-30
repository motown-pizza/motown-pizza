/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { TableBookingGet } from '@repo/types/models/table-booking';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const tableBookingRecords = await prisma.tableBooking.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: tableBookingRecords },
      { status: 200, statusText: 'TableBookings Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tableBookings):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      tableBookings,
      deletedIds,
    }: { tableBookings: TableBookingGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.tableBooking.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = tableBookings.map((tableBooking) =>
      prisma.tableBooking.upsert({
        where: { id: tableBooking.id },
        update: {
          ...tableBooking,
          updated_at: new Date(tableBooking.updated_at),
        },
        create: {
          ...tableBooking,
          created_at: new Date(tableBooking.created_at),
          updated_at: new Date(tableBooking.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateTableBookings = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateTableBookings },
      { status: 200, statusText: 'TableBookings Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tableBookings):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
