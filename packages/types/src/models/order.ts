import { Prisma, Order } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type OrderCreate = Prisma.OrderCreateInput;

// Type for updating a item (all fields optional except id)
export type OrderUpdate = Prisma.OrderUpdateInput;

// Type for default item (with id and no relations)
export type OrderGet = Order;

// Type for fetched item with relations
export type OrderRelations = Prisma.OrderGetPayload<{
  include: {
    _count: { select: { products: true } };
    products: true;
  };
}>;
