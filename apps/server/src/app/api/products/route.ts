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

export async function GET() {
  try {
    const productRecords = await prisma.product.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: productRecords },
      { status: 200, statusText: 'Products Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get products):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      products,
      deletedIds,
    }: { products: ProductGet[]; deletedIds?: string[] } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.product.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = products.map((product) =>
      prisma.product.upsert({
        where: { id: product.id },
        update: {
          ...product,
          updated_at: new Date(product.updated_at),
        },
        create: {
          ...product,
          created_at: new Date(product.created_at),
          updated_at: new Date(product.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateProducts = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateProducts },
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
