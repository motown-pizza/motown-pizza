import { Prisma, RecipieItem } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type RecipieItemCreate = Prisma.RecipieItemCreateInput;

// Type for updating a item (all fields optional except id)
export type RecipieItemUpdate = Prisma.RecipieItemUpdateInput;

// Type for default item (with id and no relations)
export type RecipieItemGet = RecipieItem;
