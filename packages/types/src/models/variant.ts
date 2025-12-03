import { Prisma, Variant } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type VariantCreate = Prisma.VariantCreateInput;

// Type for updating a item (all fields optional except id)
export type VariantUpdate = Prisma.VariantUpdateInput;

// Type for default item (with id and no relations)
export type VariantGet = Variant;
