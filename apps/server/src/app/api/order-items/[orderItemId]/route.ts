/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { OrderItemGet } from '@repo/types/models/order-item';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> }
) {
  try {
    const { orderItemId } = await params;

    const orderItemRecord = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    return NextResponse.json(
      { item: orderItemRecord },
      { status: 200, statusText: 'Order Item Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get order items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> }
) {
  try {
    const { orderItemId } = await params;

    const orderItem: OrderItemGet = await request.json();

    const updateOrderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: orderItem,
    });

    return NextResponse.json(
      { items: updateOrderItem },
      { status: 200, statusText: 'Order Items Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update order items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
