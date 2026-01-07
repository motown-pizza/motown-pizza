/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { ProductGet } from '@repo/types/models/product';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const productRecord = await prisma.product.findUnique({
      where: { id: productId },
    });

    return NextResponse.json(
      { item: productRecord },
      { status: 200, statusText: 'Product Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get products):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const product: ProductGet = await request.json();

    const updateProduct = await prisma.product.update({
      where: { id: productId },
      data: product,
    });

    return NextResponse.json(
      { items: updateProduct },
      { status: 200, statusText: 'Products Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update products):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
