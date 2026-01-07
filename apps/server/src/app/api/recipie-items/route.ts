/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { RecipieItemGet } from '@repo/types/models/recipie-item';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const recipieItemRecords = await prisma.recipieItem.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: recipieItemRecords },
      { status: 200, statusText: 'Recipie Items Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get recipie items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      recipieItems,
      deletedIds,
    }: { recipieItems: RecipieItemGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.recipieItem.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = recipieItems.map((recipieItem) =>
      prisma.recipieItem.upsert({
        where: { id: recipieItem.id },
        update: {
          ...recipieItem,
          updated_at: new Date(recipieItem.updated_at),
        },
        create: {
          ...recipieItem,
          created_at: new Date(recipieItem.created_at),
          updated_at: new Date(recipieItem.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateRecipieItems = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateRecipieItems },
      { status: 200, statusText: 'Recipie Items Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update recipie items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
