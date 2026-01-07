import { Prisma, ProductVariant } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type ProductVariantCreate = Prisma.ProductVariantCreateInput;

// Type for updating a item (all fields optional except id)
export type ProductVariantUpdate = Prisma.ProductVariantUpdateInput;

// Type for default item (with id and no relations)
export type ProductVariantGet = ProductVariant;

// Type for fetched item with relations
export type ProductVariantRelations = Prisma.ProductVariantGetPayload<{
  include: {
    _count: { select: { order_items: true; recipie_items: true } };
  };
}>;
