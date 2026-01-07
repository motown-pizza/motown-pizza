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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transporterId: string }> }
) {
  try {
    const { transporterId } = await params;

    const transporterRecord = await prisma.transporter.findUnique({
      where: { id: transporterId },
    });

    return NextResponse.json(
      { item: transporterRecord },
      { status: 200, statusText: 'Transporter Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get transporters):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ transporterId: string }> }
) {
  try {
    const { transporterId } = await params;

    const transporter: TransporterGet = await request.json();

    const updateTransporter = await prisma.transporter.update({
      where: { id: transporterId },
      data: transporter,
    });

    return NextResponse.json(
      { items: updateTransporter },
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
