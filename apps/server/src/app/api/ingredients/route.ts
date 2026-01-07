/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { IngredientGet } from '@repo/types/models/ingredient';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const ingredientRecords = await prisma.ingredient.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: ingredientRecords },
      { status: 200, statusText: 'Ingredients Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get ingredients):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      ingredients,
      deletedIds,
    }: { ingredients: IngredientGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.ingredient.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = ingredients.map((ingredient) =>
      prisma.ingredient.upsert({
        where: { id: ingredient.id },
        update: {
          ...ingredient,
          updated_at: new Date(ingredient.updated_at),
        },
        create: {
          ...ingredient,
          created_at: new Date(ingredient.created_at),
          updated_at: new Date(ingredient.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateIngredients = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateIngredients },
      { status: 200, statusText: 'Ingredients Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update ingredients):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
