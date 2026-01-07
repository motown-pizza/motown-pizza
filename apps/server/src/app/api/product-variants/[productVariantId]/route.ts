/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { ProductVariantGet } from '@repo/types/models/product-variant';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productVariantId: string }> }
) {
  try {
    const { productVariantId } = await params;

    const productVariantRecord = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    return NextResponse.json(
      { item: productVariantRecord },
      { status: 200, statusText: 'Product Variant Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get product variants):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productVariantId: string }> }
) {
  try {
    const { productVariantId } = await params;

    const productVariant: ProductVariantGet = await request.json();

    const updateProductVariant = await prisma.productVariant.update({
      where: { id: productVariantId },
      data: productVariant,
    });

    return NextResponse.json(
      { items: updateProductVariant },
      { status: 200, statusText: 'Product Variants Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update product variants):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
