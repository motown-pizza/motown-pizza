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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableBookingId: string }> }
) {
  try {
    const { tableBookingId } = await params;

    const tableBookingRecord = await prisma.tableBooking.findUnique({
      where: { id: tableBookingId },
    });

    return NextResponse.json(
      { item: tableBookingRecord },
      { status: 200, statusText: 'TableBooking Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tableBookings):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableBookingId: string }> }
) {
  try {
    const { tableBookingId } = await params;

    const tableBooking: TableBookingGet = await request.json();

    const updateTableBooking = await prisma.tableBooking.update({
      where: { id: tableBookingId },
      data: tableBooking,
    });

    return NextResponse.json(
      { items: updateTableBooking },
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
