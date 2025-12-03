import { Prisma, Product } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type ProductCreate = Prisma.ProductCreateInput;

// Type for updating a item (all fields optional except id)
export type ProductUpdate = Prisma.ProductUpdateInput;

// Type for default item (with id and no relations)
export type ProductGet = Product;

// Type for fetched item with relations
export type ProductRelations = Prisma.ProductGetPayload<{
  include: {
    _count: { select: { orders: true; variants: true } };
  };
}>;
