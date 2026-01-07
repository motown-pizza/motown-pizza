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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ingredientId: string }> }
) {
  try {
    const { ingredientId } = await params;

    const ingredientRecord = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });

    return NextResponse.json(
      { item: ingredientRecord },
      { status: 200, statusText: 'Ingredient Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get ingredients):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ingredientId: string }> }
) {
  try {
    const { ingredientId } = await params;

    const ingredient: IngredientGet = await request.json();

    const updateIngredient = await prisma.ingredient.update({
      where: { id: ingredientId },
      data: ingredient,
    });

    return NextResponse.json(
      { items: updateIngredient },
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
