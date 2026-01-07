/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { TransporterGet } from '@repo/types/models/transporter';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const transporterRecords = await prisma.transporter.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: transporterRecords },
      { status: 200, statusText: 'Transporters Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get transporters):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      transporters,
      deletedIds,
    }: { transporters: TransporterGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.transporter.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = transporters.map((transporter) =>
      prisma.transporter.upsert({
        where: { id: transporter.id },
        update: {
          ...transporter,
          updated_at: new Date(transporter.updated_at),
        },
        create: {
          ...transporter,
          created_at: new Date(transporter.created_at),
          updated_at: new Date(transporter.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateTransporters = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateTransporters },
      { status: 200, statusText: 'Transporters Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update transporters):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
