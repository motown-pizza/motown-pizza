import { Prisma, Ingredient } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type IngredientCreate = Prisma.IngredientCreateInput;

// Type for updating a item (all fields optional except id)
export type IngredientUpdate = Prisma.IngredientUpdateInput;

// Type for default item (with id and no relations)
export type IngredientGet = Ingredient;

// Type for fetched item with relations
export type IngredientRelations = Prisma.IngredientGetPayload<{
  include: {
    _count: { select: { recipie_items: true; stock_movements: true } };
  };
}>;
