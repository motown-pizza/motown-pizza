import { Prisma, OrderItem } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type OrderItemCreate = Prisma.OrderItemCreateInput;

// Type for updating a item (all fields optional except id)
export type OrderItemUpdate = Prisma.OrderItemUpdateInput;

// Type for default item (with id and no relations)
export type OrderItemGet = OrderItem;
