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

export async function GET() {
  try {
    const productVariantRecords = await prisma.productVariant.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: productVariantRecords },
      { status: 200, statusText: 'Product Variants Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get product variants):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      productVariants,
      deletedIds,
    }: { productVariants: ProductVariantGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.productVariant.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = productVariants.map((productVariant) =>
      prisma.productVariant.upsert({
        where: { id: productVariant.id },
        update: {
          ...productVariant,
          updated_at: new Date(productVariant.updated_at),
        },
        create: {
          ...productVariant,
          created_at: new Date(productVariant.created_at),
          updated_at: new Date(productVariant.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateProductVariants = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateProductVariants },
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
