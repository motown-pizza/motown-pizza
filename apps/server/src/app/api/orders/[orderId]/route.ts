/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { OrderGet } from '@repo/types/models/order';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const orderRecord = await prisma.order.findUnique({
      where: { id: orderId },
    });

    return NextResponse.json(
      { item: orderRecord },
      { status: 200, statusText: 'Order Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get orders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order: OrderGet = await request.json();

    const updateOrder = await prisma.order.update({
      where: { id: orderId },
      data: order,
    });

    return NextResponse.json(
      { items: updateOrder },
      { status: 200, statusText: 'Orders Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update orders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
