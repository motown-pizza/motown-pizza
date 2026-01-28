import { Prisma, Table } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type TableCreate = Prisma.TableCreateInput;

// Type for updating a item (all fields optional except id)
export type TableUpdate = Prisma.TableUpdateInput;

// Type for default item (with id and no relations)
export type TableGet = Table;

// Type for fetched item with relations
export type TableRelations = Prisma.TableGetPayload<{
  include: {
    _count: { select: { tableBookings: true } };
  };
}>;
