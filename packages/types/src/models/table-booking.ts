import { Prisma, TableBooking } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type TableBookingCreate = Prisma.TableBookingCreateInput;

// Type for updating a item (all fields optional except id)
export type TableBookingUpdate = Prisma.TableBookingUpdateInput;

// Type for default item (with id and no relations)
export type TableBookingGet = TableBooking;

// Type for fetched item with relations
export type TableBookingRelations = Prisma.TableBookingGetPayload<{
  include: {
    _count: { select: { orders: true } };
  };
}>;
