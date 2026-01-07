import { Prisma, Transporter } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type TransporterCreate = Prisma.TransporterCreateInput;

// Type for updating a item (all fields optional except id)
export type TransporterUpdate = Prisma.TransporterUpdateInput;

// Type for default item (with id and no relations)
export type TransporterGet = Transporter;

// Type for fetched item with relations
export type TransporterRelations = Prisma.TransporterGetPayload<{
  include: {
    _count: { select: { orders: true } };
  };
}>;
