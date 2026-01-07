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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipieItemId: string }> }
) {
  try {
    const { recipieItemId } = await params;

    const recipieItemRecord = await prisma.recipieItem.findUnique({
      where: { id: recipieItemId },
    });

    return NextResponse.json(
      { item: recipieItemRecord },
      { status: 200, statusText: 'Recipie Item Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get recipie items):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recipieItemId: string }> }
) {
  try {
    const { recipieItemId } = await params;

    const recipieItem: RecipieItemGet = await request.json();

    const updateRecipieItem = await prisma.recipieItem.update({
      where: { id: recipieItemId },
      data: recipieItem,
    });

    return NextResponse.json(
      { items: updateRecipieItem },
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
