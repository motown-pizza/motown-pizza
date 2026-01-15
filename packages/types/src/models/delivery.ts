import { Prisma, Delivery } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type DeliveryCreate = Prisma.DeliveryCreateInput;

// Type for updating a item (all fields optional except id)
export type DeliveryUpdate = Prisma.DeliveryUpdateInput;

// Type for default item (with id and no relations)
export type DeliveryGet = Delivery;

// Type for fetched item with relations
export type DeliveryRelations = Prisma.DeliveryGetPayload<{
  include: {
    order: true;
  };
}>;
