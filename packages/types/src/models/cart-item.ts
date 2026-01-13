import { Prisma, CartItem } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type CartItemCreate = Prisma.CartItemCreateInput;

// Type for updating a item (all fields optional except id)
export type CartItemUpdate = Prisma.CartItemUpdateInput;

// Type for default item (with id and no relations)
export type CartItemGet = CartItem;

// Type for fetched item with relations
export type CartItemRelations = Prisma.CartItemGetPayload<{
  include: {
    product_variant: true;
  };
}>;
