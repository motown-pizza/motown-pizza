import { Prisma, WishlistItem } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type WishlistItemCreate = Prisma.WishlistItemCreateInput;

// Type for updating a item (all fields optional except id)
export type WishlistItemUpdate = Prisma.WishlistItemUpdateInput;

// Type for default item (with id and no relations)
export type WishlistItemGet = WishlistItem;

// Type for fetched item with relations
export type WishlistItemRelations = Prisma.WishlistItemGetPayload<{
  include: {
    product_variant: true;
  };
}>;
