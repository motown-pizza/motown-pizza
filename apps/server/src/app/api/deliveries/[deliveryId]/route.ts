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
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    const { deliveryId } = await params;

    const deliveryRecord = await prisma.delivery.findUnique({
      where: { id: deliveryId },

      include: {
        profile: true,
        order: true,
      },
    });

    return NextResponse.json(
      { item: deliveryRecord },
      { status: 200, statusText: 'Post Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get delivery):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
