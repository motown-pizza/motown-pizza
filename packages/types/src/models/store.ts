import { Prisma, Store } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type StoreCreate = Prisma.StoreCreateInput;

// Type for updating a item (all fields optional except id)
export type StoreUpdate = Prisma.StoreUpdateInput;

// Type for default item (with id and no relations)
export type StoreGet = Store;

// Type for fetched item with relations
export type StoreRelations = Prisma.StoreGetPayload<{
  include: {
    _count: { select: { orders: true } };
  };
}>;
